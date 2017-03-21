import json
import os
import csv
from collections import OrderedDict

from libsbml import *

from django.conf import settings


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
    if 'timeUnit' in cell_data:
        data['timeUnit'] = cell_data['timeUnit']
    else:
        data['timeUnit'] = 'second'
    data['csv'] = data_str

    return data


def extract_species_and_phases_from_model(filename):
    """
    :param filename: the SBML model input file name
    :return: id_to_names, name_to_ids, species, phases quadruple where id_to_names is a dict that
             maps id to names for all species and phases and name_to_ids is a dict that maps names
             to ids for all species and phases; species is a list of pure species ids, and
             phases is a dict that has phases ids as keys and corresponding subphases ids list
             as values
    """
    model_file = os.path.join(settings.MODEL_INPUT_PATH, filename.encode("utf-8"))
    reader = SBMLReader()
    document = reader.readSBMLFromFile(model_file)
    if document.getNumErrors() > 0:
        raise Exception("readSBMLFromFile() exception: " + document.printErrors())
    model = document.getModel()

    species = []
    # extract species
    species_lst = model.getListOfSpecies()
    id_to_names = {}
    name_to_ids = {}
    for sp in species_lst:
        name = sp.getName()
        id = sp.getId()
        id_to_names[id] = name
        name_to_ids[name] = id
        species.append(id)

    # extract phases
    rule_list = model.getListOfRules()

    phases = {}
    for rule in rule_list:
        sub_phases = []
        var_id = rule.getVariable()
        if var_id:
            formula_str = rule.getFormula().strip()
            if formula_str:
                formula_strs = formula_str.split('+')
                for fstr in formula_strs:
                    fstr = fstr.strip()
                    sub_phases.append(fstr)
                    # remove sub-phases from species
                    species.remove(fstr)
            phases[var_id] = sub_phases
            # remove phases from species
            species.remove(var_id)

    return id_to_names, name_to_ids, species, phases


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
    "reactions": [
      {
        "reactant": "G1_001",
        "product": "G1_002",
        "kf": 0.33
      },
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

        # extract reactions
        react_list = []
        reactions = model.getListOfReactions()
        for react in reactions:
            reactant = react.getListOfReactants().get(0)
            if reactant:
                react_species = species_id_to_names[reactant.getSpecies()]
            else:
                continue
            product = react.getListOfProducts().get(0)
            if product:
                product_species = species_id_to_names[product.getSpecies()]
            else:
                continue
            react_dict = OrderedDict()
            react_dict['reactant'] = react_species
            react_dict['product'] = product_species
            kl = react.getKineticLaw()
            if kl:
                param_list = kl.getListOfParameters()
                if param_list:
                    react_dict[param_list[0].getName()] = param_list[0].getValue()
                    react_list.append(react_dict)

        return_object['reactions'] = react_list

        # extract speciesPhaseMatrix and speciesMatrix
        species_name_list = [s['name'] for s in species_list]
        phase_name_list = [p['name'] for p in phases]
        s_p_dict = OrderedDict()
        s_s_dict = OrderedDict()
        # initialize the matrix list
        for sname in species_name_list:
            p_dict = OrderedDict()
            s_dict = OrderedDict()
            for pname in phase_name_list:
                p_dict[pname] = 0
            s_p_dict[sname] = p_dict
            for ssname in species_name_list:
                s_dict[ssname] = 0
            s_s_dict[sname] = s_dict

        paras = model.getListOfParameters()
        for para in paras:
            para_names = para.getName().split('_')
            name1 = para_names[1]
            name2 = para_names[2]
            if name1 in species_name_list and name2 in phase_name_list:
                s_p_dict[name1][name2] = para.getValue()
            elif name1 in species_name_list and name2 in species_name_list:
                s_s_dict[name1][name2] = para.getValue()

        s_p_matrix = []
        for s_name, s_value in s_p_dict.iteritems():
            p_list = []
            for p_name, p_value in s_value.iteritems():
                p_list.append(p_value)
            s_p_matrix.append(p_list)

        return_object['speciesPhaseMatrix'] = s_p_matrix

        if filename == 'test_model.xml':
            s_s_matrix = [
                [
                    [0, -0.6],
                    [0.4, 0]
                ],
                [
                    [0, 0.7],
                    [-0.4, 0]
                ],
                [
                    [0, -0.2],
                    [0.5, 0]
                ]
            ]
        elif filename == 'test_model2.xml':
            s_s_matrix = [
                [
                    [0, -0.6, 0.3, -0.1],
                    [0, -0.6, 0.3, -0.1],
                    [0.2, -0.3, 0, 0.2],
                    [0.1, 0.4, 0, 0]
                ],
                [
                    [0, 0.7, 0, 0],
                    [-0.4, 0, 0.1, 0.5],
                    [-0.2, 0, 0, -0.3],
                    [0, 0, 0.4, 0]
                ],
                [
                    [0, -0.2, 0.4, 0.1],
                    [0.5, 0, 0.1, 0.4],
                    [0.5, 0.2, 0, -0.4],
                    [-0.5, 0, -0.1, 0]
                ]
            ]
        else:
            s_s_matrix = []
            # TODO: Our current model does not include phase info in species to species interaction, so
            # replicate same species to species interaction across all phases until we have this info
            # in the model
            for phase in phases:
                p_s_s_matrix = []
                for s_name, s_value in s_s_dict.iteritems():
                    s_list = []
                    for ss_name, ss_value in s_value.iteritems():
                        s_list.append(ss_value)
                    p_s_s_matrix.append(s_list)
                s_s_matrix.append(p_s_s_matrix)

        return_object['speciesMatrices'] = s_s_matrix

        jsondump = json.dumps(return_object)
        # logger.debug('info extracted from model: ' + jsondump)
        return jsondump
    except Exception as ex:
        return_object['error'] = ex.message
        jsondump = json.dumps(return_object)
        return jsondump


def load_model(model):
    modelData = {}
    modelData['name'] = model['name']
    modelData['description'] = model['description']
    modelData['fileName'] = model['fileName']

    data = json.loads(extract_info_from_model(model['fileName']))
    modelData['species'] = data['species']
    modelData['phases'] = data['phases']
    modelData['speciesPhaseMatrix'] = data['speciesPhaseMatrix']
    modelData['speciesMatrices'] = data['speciesMatrices']
    modelData['reactions'] = data['reactions']

    return modelData


def get_profile_list():
    profile_config_name = "data/config/profile_list.json"
    data = []
    with open(profile_config_name, 'r') as profile_config_file:
        config_data = json.load(profile_config_file)
        for pdata in config_data:
            p_filename = pdata['fileName']
            if os.path.isfile(p_filename):
                with open(p_filename, 'r') as profile_file:
                    data.append(json.load(profile_file))

    return data


def delete_profile(pname):
    profile_config_name = "data/config/profile_list.json"
    with open(profile_config_name, 'r') as profile_config_file:
        config_data = json.load(profile_config_file)
        for pdata in config_data:
            p_filename = pdata['fileName']
            if os.path.isfile(p_filename):
                with open(p_filename, 'r') as profile_file:
                    data = json.load(profile_file)
                    if data['name'] == pname:
                        # delete this profile
                        os.remove(p_filename)
                        config_data.remove(pdata)
                        break

    # update profile_list
    with open(profile_config_name, 'w') as f:
        f.write(json.dumps(config_data))


def get_phase_start_stop(data):
    """
    Get start and stop for a phase or subphase from the input time series data where start is
    indicated by a value of 1 and stop is indicated by a value of 0 in the time series data
    :param data: the time series data list
    :return: the indices in the data list for the start and stop
    """
    if data[0] > 0:
        phase_start_idx = 0
        phase_stop_idx = -1
        start_idx = 1 # the index in the data list to start searching
    else:
        phase_start_idx = -1
        phase_stop_idx = -1
        start_idx = 0

    for idx, val in enumerate(data):
        if idx < start_idx:
            continue
        if phase_start_idx != -1 and val == 0: # phase has stopped, record the stop
            phase_stop_idx = idx
            break
        if phase_start_idx == -1 and val > 0:
            phase_start_idx = idx

    return phase_start_idx, phase_stop_idx


def extract_parameters(filename):
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
    return paras_list
