import csv
import json
import os
from collections import OrderedDict

from django.http import HttpResponse, FileResponse
from django.template import loader
from django.conf import settings

from libsbml import *

from . import utils
from .tasks import run_model_task

# Create your views here.
def index(request):
    profile_data = utils.get_profile_list()
    model_fname = os.path.basename(profile_data[0]['models'][0]['fileName'])
    template = loader.get_template('cc_core/index.html')
    context = {
        'SITE_TITLE': settings.SITE_TITLE,
        'model_input_file_name': model_fname,
        'text_to_display': "This Cell Cycle Browser allows exploration and simulation of the human cell cycle.",
    }
    return HttpResponse(template.render(context, request))


def serve_data(request, filename):
    data_file = os.path.join('data', filename)
    response = HttpResponse(content_type='text/csv')
    writer = csv.writer(response)
    with open(data_file, 'rb') as fp:
        data = csv.reader(fp)
        for row in data:
            writer.writerow(row)

    return response


def serve_config_data(request, filename):
    config_file = os.path.join('data', 'config', filename)
    with open(config_file, 'r') as fp:
        data = json.load(fp)
    return HttpResponse(json.dumps(data), content_type='application/json')


def extract_phases(request, filename):
    """
    extract phases from the model file and return phases as downloadable JSON file
    :param request: a request in the form of /phases/<model_file_name>
    :param filename: the model file name
    :return: Downloadable JSON file that contain phases
    """

    return_object = {}
    try:
        model_file = os.path.join(settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
        reader = SBMLReader()
        document = reader.readSBMLFromFile(model_file)
        if document.getNumErrors() > 0:
            raise Exception("readSBMLFromFile() exception: " + document.printErrors())
        model = document.getModel()
        species_id_to_names = {}
        species = model.getListOfSpecies()
        for sp in species:
            name = sp.getName()
            id = sp.getId()
            species_id_to_names[id] = name

        rule_list = model.getListOfRules()
        phases = []
        for rule in rule_list:
            phase = {}
            var_id = rule.getVariable()
            if var_id:
                phase["name"] = species_id_to_names[var_id]
                sub_phases = []
                formula_str = rule.getFormula().strip()
                if formula_str:
                    formula_strs = formula_str.split('+')
                    for fstr in formula_strs:
                        fstr = fstr.strip()
                        sub_phases.append(species_id_to_names[fstr])
                    phase["sub_phases"] = sub_phases
                    phases.append(phase)

        return_object['phases'] = phases
        jsondump = json.dumps(return_object)
        response = HttpResponse(jsondump, content_type='text/json')
        out_file_name = os.path.splitext(filename)[0] + "_phases.json"
        response['Content-Disposition'] = 'attachment; filename="' + out_file_name + '"'
        return response
    except Exception as ex:
        return_object['error'] = ex.message
        jsondump = json.dumps(return_object)
        response = HttpResponse(jsondump, content_type='text/json')
        response['Content-Disposition'] = 'attachment; filename=error.json'
        return response


def extract_species(request, filename):
    """
    extract species from the model file and return species as downloadable JSON file
    :param request: a request in the form of /phases/<model_file_name>
    :param filename: the model file name
    :return: Downloadable JSON file that contain species
    """

    return_object = {}
    try:
        model_file = os.path.join(settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
        reader = SBMLReader()
        document = reader.readSBMLFromFile(model_file)
        if document.getNumErrors() > 0:
            raise Exception("readSBMLFromFile() exception: " + document.printErrors())
        model = document.getModel()
        species = model.getListOfSpecies()
        species_list = []
        for sp in species:
            species_dict = {}
            species_dict['name'] = sp.getName()
            species_dict['initial_amount'] = sp.getInitialAmount()
            species_list.append(species_dict)

        return_object['species'] = species_list
        jsondump = json.dumps(return_object)
        response = HttpResponse(jsondump, content_type='text/json')
        out_file_name = os.path.splitext(filename)[0] + "_species.json"
        response['Content-Disposition'] = 'attachment; filename="' + out_file_name + '"'
        return response
    except Exception as ex:
        return_object['error'] = ex.message
        jsondump = json.dumps(return_object)
        response = HttpResponse(jsondump, content_type='text/json')
        response['Content-Disposition'] = 'attachment; filename=error.json'
        return response


def extract_parameters(request, filename):
    """
    extract parameters from the model file and return parameters as downloadable JSON file
    :param request: a request in the form of /phases/<model_file_name>
    :param filename: the model file name
    :return: Downloadable JSON file that contain parameters
    """

    return_object = {}
    try:
        model_file = os.path.join(settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
        reader = SBMLReader()
        document = reader.readSBMLFromFile(model_file)
        if document.getNumErrors() > 0:
            raise Exception("readSBMLFromFile() exception: " + document.printErrors())
        model = document.getModel()
        id_to_names = {}
        species = model.getListOfSpecies()
        for sp in species:
            name = sp.getName()
            id = sp.getId()
            id_to_names[id] = name
        paras = model.getListOfParameters()
        paras_list = []
        for para in paras:
            paras_dict = {}
            paras_dict['name'] = para.getName()
            paras_dict['value'] = para.getValue()
            paras_list.append(paras_dict)
            id_to_names[para.getId()] = paras_dict['name']

        reactions = model.getListOfReactions()
        for react in reactions:
            react_dict = OrderedDict()
            reactant = react.getListOfReactants().get(0)
            if reactant:
                react_species = id_to_names[reactant.getSpecies()]
            else:
                react_species = "null"
            react_dict['reactant'] = react_species
            product = react.getListOfProducts().get(0)
            if product:
                product_species = id_to_names[product.getSpecies()]
            else:
                product_species = "null"
            react_dict['product'] = product_species
            kl = react.getKineticLaw()
            if kl:
                param_list = kl.getListOfParameters()
                if param_list:
                    react_dict['name'] = param_list[0].getName()
                    react_dict['value'] = param_list[0].getValue()
                    pid = param_list[0].getId()
                    formula = kl.getFormula()
                    if formula:
                        for key, value in id_to_names.items():
                            formula = formula.replace(key, value)
                        formula = formula.replace(pid, react_dict['name'])
                        react_dict['formula'] = formula
            paras_list.append(react_dict)

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


def get_profile_list(request):
    """
    It is invoked by an AJAX call, so it returns json object that holds data set list
    """
    profile_list = utils.get_profile_list()

    return HttpResponse(
        json.dumps(profile_list),
        content_type='application/json'
    )


def load_model_json(model):
    modelData = {}
    modelData['name'] = model['name']
    modelData['description'] = model['description']

    with open(model['fileName'], 'r') as json_file:
        data = json.load(json_file)

    modelData['species'] = data['species']
    modelData['phases'] = data['phases']
    modelData['speciesPhaseMatrix'] = data['speciesPhaseMatrix']
    modelData['speciesMatrices'] = data['speciesMatrices']

    return modelData


def load_cell_data_csv(cell_data):
    with open(cell_data['fileName'], 'r') as csv_file:
        csv_data = csv_file.read()

    data = {}
    data['name'] = cell_data['name']
    data['description'] = cell_data['description']
    data['csv'] = csv_data

    return data


def get_profile(request):
    index = int(request.POST['index'])
    profile = utils.get_profile_list()[index]

    data = {}
    data['name'] = profile['name']
    data['description'] = profile['description']

    if 'models' in profile:
        data['models'] = [load_model_json(m) for m in profile['models']]

    if 'cellData' in profile:
        data['cellData'] = [load_cell_data_csv(d) for d in profile['cellData']]

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


def run_model(request, filename):
    traj = request.POST['trajectories']
    end = request.POST['end']

    task = run_model_task.apply_async((filename, traj, end), countdown=3)

    context = {
        'task_id': task.task_id,
    }
    template = loader.get_template('cc_core/index.html')
    return HttpResponse(template.render(context, request))


def download_model_result(request, filename):
    file_full_path = settings.MODEL_OUTPUT_PATH + filename
    response = FileResponse(open(file_full_path, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + filename + '"'
    return response


def check_task_status(request, task_id=None):
    '''
    A view function to tell the client if the asynchronous run_model() task is done.
    Args:
        request: an ajax request to check for model run status
    Returns:
        JSON response to return result from asynchronous task run_model()
    '''
    if not task_id:
        task_id = request.POST.get('task_id')
    result = run_model_task.AsyncResult(task_id)
    if result.ready():
        return HttpResponse(json.dumps({'result': result.get()}),
                            content_type="application/json")
    else:
        return HttpResponse(json.dumps({"result": None}),
                            content_type="application/json")
