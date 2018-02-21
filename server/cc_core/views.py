import json
import os
import shutil
import logging
import csv
import mimetypes
from uuid import uuid4

from django.http import HttpResponse, JsonResponse,FileResponse, \
    HttpResponseRedirect
from django.template import loader
from django.conf import settings
from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from . import utils
from .tasks import run_model_task
from .models import CellMetadata


logger = logging.getLogger('django')
guest_sess_prefix_str = 'guest_session:'


def get_guest_session(request):
    storage = messages.get_messages(request)

    for message in storage:
        if message.tags == 'info':
            if message.message.startswith(guest_sess_prefix_str):
                s_len = len(guest_sess_prefix_str)
                sess_str = message.message[s_len:]
                storage.used = False
                return sess_str

    return ''


# Create your views here.
def index(request, session=''):
    #import sys
    #sys.path.append("/home/docker/pycharm-debug")
    #import pydevd
    #pydevd.settrace('172.17.0.1', port=21000, suspend=False)


    storage = messages.get_messages(request)
    storage.used = True
    # make sure session messages and species messages are removed
    for message in storage:
        if message.tags == 'info':
            # consume it so as to clear it
            temp_str = message.message

    if session:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, session)
        if os.path.isdir(ws_path):
            messages.info(request, guest_sess_prefix_str + session)
            status_msg = 'You are in your temporary guest playground where you can explore your own data in conjunction ' \
                         'with system-provided data as specified in the guest workspace you created. The guest data will ' \
                         'exist on the server for at least 12 hours, then will be cleaned up nightly from the system.'
        else:
            status_msg = ''
    else:
        status_msg = ''

    template = loader.get_template('cc_core/index.html')
    context = {
        'SITE_TITLE': settings.SITE_TITLE,
        'status_msg': status_msg
    }
    return HttpResponse(template.render(context, request))


def about(request):
    template = loader.get_template('cc_core/about.html')
    context = {}
    return HttpResponse(template.render(context, request))


def help(request):
    template = loader.get_template('cc_core/help.html')
    context = {}
    return HttpResponse(template.render(context, request))


def cell_data_meta(request, filename):
    meta_rec = CellMetadata.objects.all().filter(cell_filename=filename).first()

    if meta_rec:
        mdict = meta_rec.metadata_dict
    else:
        mdict = {}

    context = {'metadata_dict': mdict,
               "download_url": "/download/" + filename + "/"
               }
    template = loader.get_template('cc_core/cell_meta.html')
    return HttpResponse(template.render(context, request))


def download_all_data(request):
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH

    prof_conf_name = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH, settings.WORKSPACE_CONFIG_FILENAME)
    profs = utils.get_profile_list(prof_conf_name)

    context = {'dataset_list': utils.get_dataset_list(profs),
               'model_list': utils.get_model_list(profs),
               "download_url": "/download/"
               }
    template = loader.get_template('cc_core/download_all_data.html')
    return HttpResponse(template.render(context, request))


def download_all(request):
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH

    filename = settings.DATA_ZIP_FILENAME
    full_path_filename = os.path.join(ws_path, filename)
    if not os.path.isfile(full_path_filename):
        # create the zipped file that contain all data
        utils.zip_all_data(ws_path, filename)

    # obtain mime_type to set content_type
    mtype = 'application/zip'
    # obtain file size
    stat_info = os.stat(full_path_filename)
    flen = stat_info.st_size
    f = open(full_path_filename, 'r')
    response = FileResponse(f, content_type=mtype)
    response['Content-Disposition'] = 'attachment; filename="{name}"'.format(name=filename)
    response['Content-Lengtsh'] = flen
    return response


def download(request, filename):
    _, ext = os.path.splitext(filename)
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    if ext == '.csv':
        file_full_path = os.path.join(ws_path, settings.CELL_DATA_PATH, filename)
    elif ext == '.xml':
        file_full_path = os.path.join(ws_path, settings.MODEL_INPUT_PATH, filename)
    else:
        messages.error(request, "Only dataset file in csv format and model file in xml format can be downloaded")
        return HttpResponseRedirect(request.META['HTTP_REFERER'])

    # obtain mime_type to set content_type
    mtype = 'application-x/octet-stream'
    mime_type = mimetypes.guess_type(filename)
    if mime_type[0] is not None:
        mtype = mime_type[0]

    # obtain file size
    stat_info = os.stat(file_full_path)
    flen = stat_info.st_size
    f = open(file_full_path, 'r')
    response = FileResponse(f, content_type=mtype)
    response['Content-Disposition'] = 'attachment; filename="{name}"'.format(name=filename)
    response['Content-Lengtsh'] = flen
    return response


def get_profile_list(request):
    """
    It is invoked by an AJAX call, so it returns json object that holds data set list
    """
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    profile_config_name = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH,
                                       settings.WORKSPACE_CONFIG_FILENAME)
    profile_list = utils.get_profile_list(profile_config_name)

    return HttpResponse(json.dumps(profile_list), content_type='application/json')


def get_profile(request):
    index = int(request.POST['index'])
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    profile_config_name = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH,
                                       settings.WORKSPACE_CONFIG_FILENAME)
    profile = utils.get_profile_list(profile_config_name)[index]
    data = {}

    data['name'] = profile['name']
    data['description'] = profile['description']

    if 'models' in profile:
        data['modelList'] = [m['fileName'] for m in profile['models']]

    if 'cellData' in profile:
        data['datasetList'] = [d['fileName'] for d in profile['cellData']]

    return HttpResponse(json.dumps(data), content_type='application/json')


def add_user_workspace(request):
    profiles = utils.get_profile_list()
    cell_data_names, model_data_names = utils.get_all_cell_and_model_file_names(
        profiles=profiles)
    context = {
        'guest_session_id': uuid4().hex,
        'cell_data_names': cell_data_names,
        'model_data_names': model_data_names
    }
    return render(request, 'cc_core/add-profile.html', context)


@login_required()
def add_or_delete_profile_request(request):
    profiles = utils.get_profile_list()
    referer = request.META['HTTP_REFERER']
    is_add_profile = False
    is_delete_profile = False
    if 'add_profile' in referer:
        is_add_profile = True
    if 'delete_profile' in referer:
        is_delete_profile = True

    if not is_add_profile and not is_delete_profile:
        storage = messages.get_messages(request)
        for message in storage:
            if message.tags == 'info':
                if message.message == 'AddProfile':
                    is_add_profile = True
                if message.message == 'DeleteProfile':
                    is_delete_profile = True

    if is_add_profile:
        cell_data_names, model_data_names = utils.get_all_cell_and_model_file_names(
            profiles=profiles)
        context = {
            'guest_session_id': '',
            'cell_data_names': cell_data_names,
            'model_data_names': model_data_names
        }
        return render(request, 'cc_core/add-profile.html', context)

    if is_delete_profile:
        profile_names = set()
        for p in profiles:
            profile_names.add(p['name'])
        context = {
            'profile_data_names': profile_names
        }
        return render(request, 'cc_core/delete-profile.html', context)


def delete_profile_from_server(request):
    # delete profile data from server
    sel_profile_name = request.POST.get('profile_sel_name', '')

    if sel_profile_name:
        try:
            utils.delete_profile(sel_profile_name)
            template = loader.get_template('cc_core/index.html')
            context = {
                'SITE_TITLE': settings.SITE_TITLE,
                'status_msg': 'Congratulations! The selected profile has been deleted successfully.'
            }
            return HttpResponse(template.render(context, request))
        except Exception as ex:
            messages.error(request, ex.message)
            messages.info(request, 'DeleteProfile')
            return HttpResponseRedirect(request.META['HTTP_REFERER'])


def add_profile_to_server(request):
    # create profile data to write to profile json file
    data = {}
    sess_id = request.POST.get('guest_session_id', '')
    if sess_id:
        messages.info(request, guest_sess_prefix_str + sess_id)
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_id)
        if not os.path.exists(ws_path):
            os.makedirs(os.path.join(ws_path, settings.CELL_DATA_PATH))
            os.makedirs(os.path.join(ws_path, settings.MODEL_INPUT_PATH))
            os.makedirs(os.path.join(ws_path, settings.MODEL_OUTPUT_PATH))
            os.makedirs(os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH))
    else:
        ws_path = settings.WORKSPACE_PATH

    try:
        data['name'] = request.POST.get('pname')
        if not data['name']:
            messages.error(request, "Please input a profile name.")
            messages.info(request, 'AddProfile')
            return HttpResponseRedirect(request.META['HTTP_REFERER'])

        data['description'] = request.POST.get('pdesc')
        if not data['description']:
            messages.error(request, "Please input a profile description.")
            messages.info(request, 'AddProfile')
            return HttpResponseRedirect(request.META['HTTP_REFERER'])

        cell_data_list = []
        cdfiles = request.FILES.getlist('cell_files')

        req_md_elems = []
        if cdfiles:
            req_md_elems = utils.get_required_metadata_elements()

        cdselnames = request.POST.getlist('cell_sel_names')
        filename_to_idx = {}
        idx = 0
        for cdfile in cdfiles:
            source = cdfile.file.name
            target = os.path.join(ws_path, settings.CELL_DATA_PATH, cdfile.name)
            # check to make sure the uploaded new file names don't have conflict with existing files
            if os.path.isfile(target):
                # file with the same file name already exists - raise validation error and ask user
                # to change file name to avoid file conflict
                messages.error(request, "The file " + cdfile.name +
                               " already exists on the server. Please rename this file "
                               "before uploading to the server to avoid file conflict.")
                messages.info(request, 'AddProfile')
                return HttpResponseRedirect(request.META['HTTP_REFERER'])

            with open(source, 'r') as fp:
                csv_data = csv.reader(fp)
                # validate the dataset metadata to have all required metadata elements before
                # adding the dataset into the server
                try:
                    _, _ = utils.read_metadata_from_csv_data(cdfile.name, csv_data,
                                                                 req_md_elems)
                except ValidationError as ex:
                    messages.error(request, ex.message)
                    messages.info(request, 'AddProfile')
                    return HttpResponseRedirect(request.META['HTTP_REFERER'])


            shutil.copy(source, target)
            cell_data_list.append({'fileName':cdfile.name})
            filename_to_idx[cdfile.name] = idx
            idx += 1

        for cdselname in cdselnames:
            cell_data_list.append({'fileName': cdselname})
            if sess_id:
                # copy the selected data set from system workspace to guest workspace
                source = os.path.join(settings.WORKSPACE_PATH, settings.CELL_DATA_PATH, cdselname)
                target = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_id, settings.CELL_DATA_PATH, cdselname)
                shutil.copy(source, target)
            filename_to_idx[cdselname] = idx
            idx += 1

        cdnames = request.POST.get('cdname')
        if cdnames:
            if ';' in cdnames:
                cdname_list = cdnames.split(';')
            else:
                cdname_list = [cdnames.strip()]
        else:
            cdname_list = []

        for cdname in cdname_list:
            name_pair = cdname.split(':')
            cell_data_list[filename_to_idx[name_pair[0]]]['name'] = name_pair[1]

        cddescs = request.POST.get('cddesc')
        if cddescs:
            if ';' in cddescs:
                cddesc_list = cddescs.split(';')
            else:
                cddesc_list = [cddescs.strip()]
        else:
            cddesc_list = []

        for cddesc in cddesc_list:
            desc_pair = cddesc.split(':')
            cell_data_list[filename_to_idx[desc_pair[0]]]['description'] = desc_pair[1]

        data['cellData'] = cell_data_list

        filename_to_idx = {}
        idx = 0
        model_data_list = []
        mdfiles = request.FILES.getlist('model_files')
        for mdfile in mdfiles:
            source = mdfile.file.name
            target = os.path.join(ws_path, settings.MODEL_INPUT_PATH, mdfile.name)

            if os.path.isfile(target):
                # file with the same file name already exists - raise validation error and ask user
                # to change file name to avoid file conflict
                messages.error(request, "The file " + mdfile.name +
                               " already exists on the server. Please rename this file "
                               "before uploading to the server to avoid file conflict.")
                messages.info(request, 'AddProfile')
                return HttpResponseRedirect(request.META['HTTP_REFERER'])

            shutil.copy(source, target)
            model_data_list.append({'fileName': mdfile.name})
            filename_to_idx[mdfile.name] = idx
            idx += 1

        mdselnames = request.POST.getlist('model_sel_names')
        for mdselname in mdselnames:
            model_data_list.append({'fileName': mdselname})
            if sess_id:
                # copy the selected model from system workspace to guest workspace
                source = os.path.join(settings.WORKSPACE_PATH, settings.MODEL_INPUT_PATH, mdselname)
                target = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_id, settings.MODEL_INPUT_PATH, mdselname)
                shutil.copy(source, target)
            filename_to_idx[mdselname] = idx
            idx += 1

        new_created_model_name = request.POST.get('new_sbml_model_file_name', '')
        if new_created_model_name:
            model_data_list.append({'fileName': new_created_model_name})
            filename_to_idx[new_created_model_name] = idx
            idx += 1

        mdnames = request.POST.get('mdname')
        if mdnames:
            if ';' in mdnames:
                mdname_list = mdnames.split(';')
            else:
                mdname_list = [mdnames.strip()]
        else:
            mdname_list = []

        for mdname in mdname_list:
            name_pair = mdname.split(':')
            model_data_list[filename_to_idx[name_pair[0]]]['name'] = name_pair[1]

        mddescs = request.POST.get('mddesc')
        if mddescs:
            if ';' in mddescs:
                mddesc_list = mddescs.split(';')
            else:
                mddesc_list = [mddescs.strip()]
        else:
            mddesc_list = []

        for mddesc in mddesc_list:
            desc_pair = mddesc.split(':')
            model_data_list[filename_to_idx[desc_pair[0]]]['description'] = desc_pair[1]

        data['models'] = model_data_list

        if not cell_data_list and not model_data_list:
            messages.error(request, "Please upload or select some data - you cannot leave both "
                                    "dataset and model data empty in the new profile")
            messages.info(request, 'AddProfile')
            return HttpResponseRedirect(request.META['HTTP_REFERER'])

        pname_list = data['name'].split()
        profile_file_name = '_'.join(pname_list)
        profile_file_name = profile_file_name + '.json'
        profile_file_full_path = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH, profile_file_name)
        with open(profile_file_full_path, 'w') as out:
            out.write(json.dumps(data, indent=4))

        # update configuration json file
        profile_list_name = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH, settings.WORKSPACE_CONFIG_FILENAME)
        if os.path.isfile(profile_list_name):
            with open(profile_list_name, 'r') as f:
                json_profile_data = json.load(f)
        else:
            json_profile_data = []

        json_profile_data.append({'fileName': profile_file_full_path,
                                  'group': 1})

        with open(profile_list_name, 'w') as f:
            f.write(json.dumps(json_profile_data, indent=4))

        if sess_id:
            return HttpResponseRedirect('/guest/' + sess_id)
        else:
            template = loader.get_template('cc_core/index.html')
            context = {
                'SITE_TITLE': settings.SITE_TITLE,
                'status_msg': 'Congratulations! The new workspace has been added successfully.'
            }
            return HttpResponse(template.render(context, request))
    except Exception as ex:
        messages.error(request, ex.message)
        messages.info(request, 'AddProfile')
        return HttpResponseRedirect(request.META['HTTP_REFERER'])


def get_dataset_list(request):
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH

    prof_conf_name = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH, settings.WORKSPACE_CONFIG_FILENAME)
    profs = utils.get_profile_list(prof_conf_name)
    ds_list = utils.get_dataset_list(profs)
    return HttpResponse(json.dumps(ds_list), content_type='application/json')


def get_dataset(request, id):
    filename = id
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    cell_data_filename = os.path.join(ws_path, settings.CELL_DATA_PATH, filename)
    _, csv_str = utils.load_cell_data_csv_content(cell_data_filename)
    return JsonResponse({'csv': csv_str})


def get_model_list(request):
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH

    prof_conf_name = os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH, settings.WORKSPACE_CONFIG_FILENAME)
    profs = utils.get_profile_list(prof_conf_name)
    md_list = utils.get_model_list(profs)
    return HttpResponse(json.dumps(md_list), content_type='application/json')


def get_model(request, id):
    filename = id
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    model_file = os.path.join(ws_path, settings.MODEL_INPUT_PATH, filename)
    return JsonResponse(utils.load_model_content(model_file))


def create_sbml_model(request):
    # request must be a JSON request
    num_g1 = request.POST.get('num_G1', None)
    rate_g1 = request.POST.get('rate_G1', None)
    num_s = request.POST.get('num_S', None)
    rate_s = request.POST.get('rate_S', None)
    num_g2m = request.POST.get('num_G2M', None)
    rate_g2m = request.POST.get('rate_G2M', None)
    sbml_fname = request.POST.get('sbml_file_name', '')

    sess_str = request.POST.get('sess_id', '')
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
        if not os.path.exists(ws_path):
            os.makedirs(os.path.join(ws_path, settings.CELL_DATA_PATH))
            os.makedirs(os.path.join(ws_path, settings.MODEL_INPUT_PATH))
            os.makedirs(os.path.join(ws_path, settings.MODEL_OUTPUT_PATH))
            os.makedirs(os.path.join(ws_path, settings.WORKSPACE_CONFIG_PATH))
    else:
        ws_path = settings.WORKSPACE_PATH

    response_data = {}

    if num_g1 and rate_g1 and num_s and rate_s and num_g2m and rate_g2m and sbml_fname:
        try:
            utils.createSBMLModel_CC_serial(int(num_g1), float(rate_g1),
                                            int(num_s), float(rate_s),
                                            int(num_g2m), float(rate_g2m),
                                            os.path.join(ws_path, settings.MODEL_INPUT_PATH, sbml_fname))
        except Exception as ex:
            response_data["error"] = ex.message + ' for creating SBML model'
            return HttpResponse(json.dumps(response_data), content_type='application/json')

    else:
        response_data["error"] = 'Invalid input parameters for creating SBML model'
        return HttpResponse(json.dumps(response_data), content_type='application/json')

    response_data["new_model_filename"] = sbml_fname

    return HttpResponse(json.dumps(response_data), content_type='application/json')


def delete_sbml_model(request, filename, sess_id = ''):
    response_data = {}

    sess_str = sess_id
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH

    full_fname = os.path.join(ws_path, settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
    try:
        if os.path.isfile(full_fname):
            # delete this model file
            os.remove(full_fname)
            response_data["new_model_filename"] = filename
            return HttpResponse(json.dumps(response_data), content_type='application/json')
        else:
            response_data["error"] = 'The SBML model data file does not exist'
            return HttpResponse(json.dumps(response_data), content_type='application/json')

    except Exception as ex:
        response_data["error"] = 'Invalid SBML model data file name'
        return HttpResponse(json.dumps(response_data), content_type='application/json')


def send_parameter(request):
    data = {}
    data['species'] = request.POST['species']
    data['value'] = request.POST['value']

    return HttpResponse(json.dumps(data), content_type='application/json')


def run_model(request, filename=''):
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH

    if filename:
        full_fname = os.path.join(ws_path, settings.MODEL_INPUT_PATH, filename)
        id_to_names, name_to_ids, species, phases = \
            utils.extract_species_and_phases_from_model(full_fname)

        # put species into session messages so that species can be filtered out in simulation progress return
        messages.info(request, 'species:' + ','.join(species))

        traj = request.POST.get('trajectories', 1)
        # use a big end time value which is used by stochpy to indicate end time is not used
        # but rather simulation will end when the last phase is done in the simulation
        if 'species' not in request.POST:
            sp_name_to_val_list = []
        else:
            sp_name_to_val_list = json.loads(request.POST['species'])

        if 'parameters' not in request.POST:
            sp_name_infl_para_list = []
        else:
            sp_name_infl_para_list = json.loads(request.POST['parameters'])

        pid_list = utils.extract_parameter_ids(full_fname)

        sp_id_infl_para_dict = {}
        for p_dict_item in sp_name_infl_para_list:
            phase = p_dict_item.get('phase', None)
            name1 = p_dict_item['upstream'] # species name which is an influencer
            name2 = p_dict_item['downstream'] # species or phase name which is an influencee
            val = p_dict_item['value']
            pid2 = 'p_' + name1 + '_' + name2
            if phase:
                pid1 = 'z_' + name1 + '_' + name2 + '_' + phase
                if pid1 in pid_list:
                    para_id = pid1
                elif pid2 in pid_list:
                    para_id = pid2
                else:
                    para_id = ''
            elif pid2 in pid_list:
                para_id = 'p_' + name1 + '_' + name2
            else:
                para_id = ''
            if para_id:
                sp_id_infl_para_dict[para_id] = val

        sp_id_to_val_dict = {}
        for item in sp_name_to_val_list:
            sp_name = item['species']
            sp_id = name_to_ids[sp_name]
            sp_id_to_val_dict[sp_id] = item['value']
            if 'degradation' in item:
                sp_deg = item['degradation']
                for ph in phases:
                    para_id = 'a_' + sp_name + '_' + ph
                    if para_id in pid_list:
                        sp_id_infl_para_dict[para_id] = sp_deg

        task = run_model_task.apply_async((ws_path, filename, id_to_names, species, phases, traj,
                                           sp_id_to_val_dict, sp_id_infl_para_dict),
                                          countdown=1)
        context = {
            'task_id': task.task_id,
        }
    else:
        context = {
            'task_id': '',
        }

    return HttpResponse(json.dumps(context), content_type='application/json')


def get_model_result(request, filename):
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    file_full_path = os.path.join(ws_path, settings.MODEL_OUTPUT_PATH, filename)
    with open(file_full_path, 'rb') as model_output_file:
        model_result_json = json.load(model_output_file)
        response = JsonResponse(model_result_json)
        return response

    # return bad request if the json file cannot be served above
    return HttpResponse(status=400)


def check_task_status(request):
    '''
    A view function to tell the client if the asynchronous run_model() task is done.
    Args:
        request: an ajax request to check for model run status
    Returns:
        JSON response to return result from asynchronous task run_model()
    '''
    task_id = request.POST.get('task_id')
    result = run_model_task.AsyncResult(task_id)
    ret_result = {}
    if result.ready():
        try:
            get_result = result.get()
        except Exception as ex:
            ret_result['result'] = None
            ret_result['error'] = ex.message
            return HttpResponse(json.dumps(ret_result),
                                content_type="application/json")

        ret_result['result'] = get_result
        ret_result['error'] = None
        ret_result['progress'] = None
        return HttpResponse(json.dumps(ret_result),
                            content_type="application/json")
    else:
        # read progress generated by simulation
        pstr = ''
        sp_list = []
        storage = messages.get_messages(request)
        for message in storage:
            if message.tags == 'info':
                prefix_str = 'species:'
                if message.message.startswith(prefix_str):
                    p_len = len(prefix_str)
                    sp_list = message.message[p_len:].split(',')
                    storage.used = False
                    break
        pfilename = os.path.join(settings.WORKSPACE_PATH, settings.MODEL_OUTPUT_PATH, 'progress' + task_id + '.txt')
        if os.path.isfile(pfilename):
            with open(pfilename, 'r') as pf:
                pline = pf.readline()
                pinfos = pline.split(',')
                # filtering out species from returned simulation progress
                if len(pinfos) == 2:
                    if not sp_list:
                        pstr = pline
                    elif pinfos[0] not in sp_list:
                        pstr = pline
        if pstr:
            return HttpResponse(json.dumps({"result": None, "error": None, "progress": pstr}),
                                content_type="application/json")
        else:
            return HttpResponse(json.dumps({"result": None}),
                                content_type="application/json")


def terminate_model_run(request):
    '''
    A view function to terminate model run task at user's request.
    Args:
        request: an ajax request to terminate model run task
    Returns:
        JSON response to indicate success or failure
    '''
    try:
        task_id = request.POST.get('task_id')
        run_model_task.AsyncResult(task_id).revoke(terminate=True)
    except Exception as ex:
        return JsonResponse({'status':'failure', 'message': ex.message}, status=500)

    return JsonResponse({'status': 'success'})


def extract_parameters(request, filename):
    """
    extract parameters from the model file and return parameters as downloadable JSON file
    :param request: a request in the form of /phases/<model_file_name>
    :param filename: the model file name
    :return: Downloadable JSON file that contain parameters
    """

    return_object = {}
    sess_str = get_guest_session(request)
    if sess_str:
        ws_path = os.path.join(settings.GUEST_WORKSPACE_PATH, sess_str)
    else:
        ws_path = settings.WORKSPACE_PATH
    try:
        model_file = os.path.join(ws_path, settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
        paras_list = utils.extract_parameters(model_file)
        return_object['parameters'] = paras_list
        jsondump = json.dumps(return_object)
        response = HttpResponse(jsondump, content_type='text/json')
        out_file_name = os.path.splitext(filename)[0] + "_parameters.json"
        response['Content-Disposition'] = 'attachment; filename="' + out_file_name + '"'
        return response
    except Exception as ex:
        return_object['error'] = ex.message
        jsondump = json.dumps(return_object)
        response = HttpResponse(jsondump, content_type='text/json')
        response['Content-Disposition'] = 'attachment; filename=error.json'
        return response
