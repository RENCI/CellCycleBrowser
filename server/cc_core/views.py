import csv
import json
import os
from collections import OrderedDict
import logging

from libsbml import *

from django.http import HttpResponse, FileResponse
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
        'text_to_display': "This Cell Cycle Browser allows exploration and simulation of the human cell cycle.",
    }
    return HttpResponse(template.render(context, request))


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


def extract_info_from_model(filename):
    """
    extract species, phases, speciesPhaseMatrix, and speciesMatrices info from the model file and
    return info as JSON string in the format of
    "species": [
      {
        "name": "53BP1",
        "min": 0,
        "max": 5,
        "value": 5
      },
      ...
    ]
    "phases": [
     {
       "name": "G1"
     },
     ...
    ],
    "speciesPhaseMatrix": [
      [-0.3, 0, -0.1],
      [0, 0, 0]
      ...
    ],
    "speciesMatrices": [
      [
        [0, 0],
        [0, 0]
      ],
      ...
    ]
    :param filename: the model file name
    :return: JSON string as detailed above
    """

    return_object = {}
    try:
        model_file = os.path.join(settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
        reader = SBMLReader()
        document = reader.readSBMLFromFile(model_file)
        if document.getNumErrors() > 0:
            raise Exception("readSBMLFromFile() exception: " + document.printErrors())
        model = document.getModel()

        # extract species
        species = model.getListOfSpecies()
        species_list = []
        species_id_to_names = {}
        for sp in species:
            name = sp.getName()
            id = sp.getId()
            species_id_to_names[id] = name
            species_dict = {}
            species_dict['name'] = sp.getName()
            species_dict['value'] = sp.getInitialAmount()
            # TO DO: extract min and max info from the model
            species_dict['min'] = 0
            species_dict['max'] = 5
            species_list.append(species_dict)

        # extract phases
        rule_list = model.getListOfRules()
        phases = []
        sub_phases = []
        for rule in rule_list:
            phase = {}
            var_id = rule.getVariable()
            if var_id:
                phase['name'] = species_id_to_names[var_id]
                phases.append(phase)
                formula_str = rule.getFormula().strip()
                if formula_str:
                    formula_strs = formula_str.split('+')
                    for fstr in formula_strs:
                        fstr = fstr.strip()
                        sub_phases.append(species_id_to_names[fstr])

        # remove phases and sub-phases from species_list
        for ph in phases:
            for sp in species_list:
                if ph['name'] == sp['name']:
                    species_list.remove(sp)
                    break
        for sub_name in sub_phases:
            for sp in species_list:
                if sub_name == sp['name']:
                    species_list.remove(sp)
                    break

        return_object['species'] = species_list
        return_object['phases'] = phases

        # extract speciesPhaseMatrix
        s_p_dict = OrderedDict()
        # initialize the matrix list
        for s in species_list:
            p_dict = OrderedDict()
            for p in phases:
                p_dict[p['name']] = 0
            s_p_dict[s['name']] = p_dict

        paras = model.getListOfParameters()
        paras_list = []
        for para in paras:
            para_names = para.getName().split('_')
            spec_name = para_names[1]
            phase_name = para_names[2]
            s_p_dict[spec_name][phase_name] = para.getValue()

        s_p_matrix = []
        for s_name, s_value in s_p_dict.iteritems():
            p_list = []
            for p_name, p_value in s_value.iteritems():
                p_list.append(p_value)
            s_p_matrix.append(p_list)

        return_object['speciesPhaseMatrix'] = s_p_matrix

        # TO DO: extract species matrices from the model
        s_s_matrix = [
            [
                [0, 0],
                [0, 0]
            ],
            [
                [0, 0],
                [0, 0]
            ],
            [
                [0, 0],
                [0, 0]
            ]
        ]
        return_object['speciesMatrices'] = s_s_matrix

        jsondump = json.dumps(return_object)
        logger.debug('info extracted from model: ' + jsondump)
        return jsondump
    except Exception as ex:
        return_object['error'] = ex.message
        jsondump = json.dumps(return_object)
        return jsondump


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


def load_model(model):
    modelData = {}
    modelData['name'] = model['name']
    modelData['description'] = model['description']

    data = json.loads(extract_info_from_model(model['fileName']))
    modelData['species'] = data['species']
    modelData['phases'] = data['phases']
    modelData['speciesPhaseMatrix'] = data['speciesPhaseMatrix']
    modelData['speciesMatrices'] = data['speciesMatrices']

    return modelData


def load_cell_data_csv(cell_data):
    data_str = ''
    cell_data_filename = os.path.join(settings.CELL_DATA_PATH,
                                      cell_data['fileName'].encode("utf-8"))
    if os.path.isfile(cell_data_filename):
        with open(cell_data_filename, 'r') as fp:
            # do data transpose before serving csv data to client
            csv_data = csv.reader(fp)
            data_list = [row for row in csv_data]
            for column in zip(*data_list):
                for y in column:
                    data_str += y + ','
                # replace last , with \n
                data_str = data_str[:-1]
                data_str += '\n'
    data = {}
    data['name'] = cell_data['name']
    data['description'] = cell_data['description']
    data['csv'] = data_str

    return data


def get_profile(request):
    index = int(request.POST['index'])
    profile = utils.get_profile_list()[index]
    data = {}
    data['name'] = profile['name']
    data['description'] = profile['description']

    if 'models' in profile:
        data['models'] = [load_model(m) for m in profile['models']]

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
