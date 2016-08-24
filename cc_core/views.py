import csv
import json
import os
from collections import OrderedDict

from django.http import HttpResponse, FileResponse
from django.template import loader
from django.conf import settings

from libsbml import *
import stochpy

# Create your views here.
def index(request):
    template = loader.get_template('cc_core/index.html')
    context = {
        'SITE_TITLE': settings.SITE_TITLE,
        'text_to_display': "This Cell Cycle Browser allows exploration and simulation of the human cell cycle.",
    }
    return HttpResponse(template.render(context, request))


def serve_data(request, filename):
    data_file = os.path.join('data', filename)
    fp = open(data_file, 'rb')
    data = csv.reader(fp)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="'+filename+'"'
    writer = csv.writer(response)
    for row in data:
        writer.writerow(row)
    
    return response


def extract_phases(request, filename):
    """
    extract phases from the model file and return phases as downloadable JSON file
    :param request: a request in the form of /phases/<model_file_name>
    :param filename: the model file name
    :return: Downloadable JSON file that contain phases
    """

    return_object = {}
    try:
        model_file = os.path.join('data/model/input', filename.encode("utf-8"))
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
        model_file = os.path.join('data/model/input', filename.encode("utf-8"))
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
        model_file = os.path.join('data/model/input', filename.encode("utf-8"))
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
    return_object = {}
    profile_list = []
    for i in range(1, 4):
        dataset_obj = {}
        dataset_obj['name'] = 'Cell Cycle Profile ' + str(i)
        dataset_obj['description'] = 'Data and models ' + str(i)
        dataset_obj['value'] = 'data/PCNA_53BP1_transpose.csv'
        profile_list.append(dataset_obj)
    return_object['profilelist'] = profile_list
    jsondump = json.dumps(return_object)
    return HttpResponse(
        jsondump,
        content_type="application/json"
    )


def run_model(request, filename, *args, **kwargs):
    num_traj = 1
    traj = request.POST['trajectories']
    if traj:
        num_traj = int(traj)
    num_end = 100
    end = request.POST['end']
    if end:
        num_end = int(end)

    smod = stochpy.SSA(IsInteractive=False)
    smod.Model(filename, 'data/model/input')
    return_object = {}
    return_object['model_file'] = str(smod.model_file)
    return_object['sim_method'] = str(smod.sim_method)
    return_object['model_dir'] = str(smod.model_dir)
    return_object['trajectories'] = num_traj
    return_object['end'] = end
    smod.DoStochSim(mode="time", trajectories=num_traj, end=num_end)
    smod.PlotSpeciesTimeSeries()
    plot_output_fname = os.path.splitext(filename)[0] + "_SpeciesTimeSeriesPlot_" + traj + "_" + end + ".pdf"
    plot_output_path_fname = 'data/model/output/' + plot_output_fname
    stochpy.plt.savefig(plot_output_path_fname)
    response = FileResponse(open(plot_output_path_fname, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + plot_output_fname + '"'
    return response
