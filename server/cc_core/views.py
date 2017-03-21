import json
import os
import shutil
import logging

from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.template import loader
from django.conf import settings
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from . import utils
from .tasks import run_model_task


logger = logging.getLogger('django')


# Create your views here.
def index(request):
    
    template = loader.get_template('cc_core/index.html')
    context = {
        'SITE_TITLE': settings.SITE_TITLE,
        'status_msg': ''
    }
    return HttpResponse(template.render(context, request))


def serve_config_data(request, filename):
    config_file = os.path.join('data', 'config', filename)
    with open(config_file, 'r') as fp:
        data = json.load(fp)
    return HttpResponse(json.dumps(data), content_type='application/json')


def get_profile_list(request):
    """
    It is invoked by an AJAX call, so it returns json object that holds data set list
    """
    profile_list = utils.get_profile_list()

    return HttpResponse(
        json.dumps(profile_list),
        content_type='application/json'
    )


def get_profile(request):
    index = int(request.POST['index'])
    profile = utils.get_profile_list()[index]
    data = {}

    data['name'] = profile['name']
    data['description'] = profile['description']

    if 'models' in profile:
        data['models'] = [utils.load_model(m) for m in profile['models']]

    if 'cellData' in profile:
        data['cellData'] = [utils.load_cell_data_csv(d) for d in profile['cellData']]

    return HttpResponse(
        json.dumps(data),
        content_type='application/json'
    )


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

    if is_add_profile:
        cell_data_names = set()
        model_data_names = set()
        for p in profiles:
            if 'cellData' in p:
                for cd in p['cellData']:
                    cell_data_names.add(cd['fileName'].encode("utf-8"))
            if 'models' in p:
                for md in p['models']:
                    model_data_names.add(md['fileName'].encode("utf-8"))

        context = {
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
        except Exception as ex:
            messages.error(request, ex.message)
            return HttpResponseRedirect(request.META['HTTP_REFERER'])

        template = loader.get_template('cc_core/index.html')
        context = {
            'SITE_TITLE': settings.SITE_TITLE,
            'status_msg': 'Congratulations! The selected profile has been deleted successfully.'
        }
        return HttpResponse(template.render(context, request))



def add_profile_to_server(request):
    # create profile data to write to profile json file
    data = {}
    data['name'] = request.POST.get('pname')
    data['description'] = request.POST.get('pdesc')
    cell_data_list = []
    cdfiles = request.FILES.getlist('cell_files')
    cdselnames = request.POST.getlist('cell_sel_names')
    filename_to_idx = {}
    idx = 0
    for cdfile in cdfiles:
        source = cdfile.file.name
        target = os.path.join(settings.CELL_DATA_PATH, cdfile.name)
        shutil.copy(source, target)
        cell_data_list.append({'fileName':cdfile.name})
        filename_to_idx[cdfile.name] = idx
        idx += 1

    for cdselname in cdselnames:
        cell_data_list.append({'fileName': cdselname})
        filename_to_idx[cdselname] = idx
        idx += 1

    cdnames = request.POST.get('cdname')
    if ';' in cdnames:
        cdname_list = cdnames.split(';')
    else:
        cdname_list = [cdnames.strip()]
    for cdname in cdname_list:
        name_pair = cdname.split(':')
        cell_data_list[filename_to_idx[name_pair[0]]]['name'] = name_pair[1]

    cddescs = request.POST.get('cddesc')
    if ';' in cddescs:
        cddesc_list = cddescs.split(';')
    else:
        cddesc_list = [cddescs.strip()]
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
        target = os.path.join(settings.MODEL_INPUT_PATH, mdfile.name)
        shutil.copy(source, target)
        model_data_list.append({'fileName': mdfile.name})
        filename_to_idx[mdfile.name] = idx
        idx += 1

    mdselnames = request.POST.getlist('model_sel_names')
    for mdselname in mdselnames:
        model_data_list.append({'fileName': mdselname})
        filename_to_idx[mdselname] = idx
        idx += 1

    mdnames = request.POST.get('mdname')
    if ';' in mdnames:
        mdname_list = mdnames.split(';')
    else:
        mdname_list = [mdnames.strip()]

    for mdname in mdname_list:
        name_pair = mdname.split(':')
        model_data_list[filename_to_idx[name_pair[0]]]['name'] = name_pair[1]

    mddescs = request.POST.get('mddesc')
    if ';' in mddescs:
        mddesc_list = mddescs.split(';')
    else:
        mddesc_list = [mddescs.strip()]
    for mddesc in mddesc_list:
        desc_pair = mddesc.split(':')
        model_data_list[filename_to_idx[desc_pair[0]]]['description'] = desc_pair[1]

    data['models'] = model_data_list

    pname_list = data['name'].split()
    profile_file_name = '_'.join(pname_list)
    profile_file_name = profile_file_name + '.json'
    profile_file_full_path = os.path.join('data', 'config', profile_file_name)
    with open(profile_file_full_path, 'w') as out:
        out.write(json.dumps(data))

    # update profile_list.json
    profile_list_name = os.path.join('data', 'config', 'profile_list.json')
    with open(profile_list_name, 'r') as f:
        json_profile_data = json.load(f)

    json_profile_data.append({'fileName': profile_file_full_path,
                              'group': 1})

    with open(profile_list_name, 'w') as f:
        f.write(json.dumps(json_profile_data))

    template = loader.get_template('cc_core/index.html')
    context = {
        'SITE_TITLE': settings.SITE_TITLE,
        'status_msg': 'Congratulations! The new profile has been added successfully.'
    }
    return HttpResponse(template.render(context, request))


def send_parameter(request):
    data = {}
    data['species'] = request.POST['species']
    data['value'] = request.POST['value']

    return HttpResponse(
        json.dumps(data),
        content_type='application/json'
    )


def run_model(request, filename=''):
    if filename:
        id_to_names, name_to_ids, species, phases = \
            utils.extract_species_and_phases_from_model(filename)

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

        sp_id_to_val_dict = {}
        for item in sp_name_to_val_list:
            sp_name = item['species']
            sp_val = item['value']
            sp_id = name_to_ids[sp_name]
            sp_id_to_val_dict[sp_id] = sp_val

        sp_id_infl_para_dict = {}
        for p_dict_item in sp_name_infl_para_list:
            phase = p_dict_item.get('phase', None)
            name1 = p_dict_item['upstream'] # species name which is an influencer
            name2 = p_dict_item['downstream'] # species or phase name which is an influencee
            val = p_dict_item['value']
            if phase:
                # special handling to make a_53BP1_p16 phase independent species-species interaction
                # to work as set up in the initial SBML model. This will not be needed after we
                # address the SBML model creation that handles all potential interactions in a
                # systematic way
                if phase == 'G1' and name1 == '53BP1' and name2 == 'p16':
                    para_id = 'a_' + name1 + '_' + name2
                else:
                    para_id = 'a_' + phase + '_' + name1 + '_' + name2
            else:
                para_id = 'a_' + name1 + '_' + name2
            sp_id_infl_para_dict[para_id] = val

        task = run_model_task.apply_async((filename, id_to_names, species, phases, traj,
                                           sp_id_to_val_dict, sp_id_infl_para_dict),
                                          countdown=1)

        context = {
            'task_id': task.task_id,
        }
    else:
        context = {
            'task_id': '',
        }

    return HttpResponse(json.dumps(context), content_type="application/json")


def get_model_result(request, filename):
    file_full_path = os.path.join(settings.MODEL_OUTPUT_PATH, filename)
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
    if result.ready():
        return HttpResponse(json.dumps({'result': result.get()}),
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
    try:
        paras_list = utils.extract_parameters(filename)
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
