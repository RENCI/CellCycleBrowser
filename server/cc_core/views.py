import json
import os
import logging

from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf import settings

from . import utils
from .tasks import run_model_task


logger = logging.getLogger('django')


# Create your views here.
def index(request):
    profile_data = utils.get_profile_list()
    model_fname = os.path.basename(profile_data[0]['models'][0]['fileName'])
    template = loader.get_template('cc_core/index.html')
    context = {
        'SITE_TITLE': settings.SITE_TITLE,
        'model_input_file_name': model_fname,
        'task_id': '',
        'text_to_display': "This Cell Cycle Browser allows exploration and simulation of the human cell cycle.",
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
