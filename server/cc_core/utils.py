import json
import os
import csv
from collections import OrderedDict

from libsbml import *

import simplesbml

from django.conf import settings
from django.core.exceptions import ValidationError

from .models import CellMetadata


def read_metadata_from_csv_data(file_base_name, csv_data, required_md_elems=[]):
    mdict = {}
    md_begin = False
    md_end = False
    first_data_row = ''
    for row in csv_data:
        if not row:
            # row is empty - filter out empty rows
            continue

        if not md_begin:
            if row[0] == '<begin metadata>':
                md_begin = True
                continue
            else:
                # no metadata is defined for this cell data, no need for further check
                first_data_row = row
                break

        if md_end:
            first_data_row = row
            break

        if md_begin:
            if row[0] == '<end metadata>':
                md_end = True
                continue

            key = row[0]
            val = row[1]
            mdict[key] = val if len(row) == 2 else ', '.join(row[1:])

    if md_begin and not md_end:
        raise ValidationError('Dataset is malformed: <begin metadata> tag '
                              'does not have <end metadata> matching tag')

    if required_md_elems:
        # validate required metadata elements are included in the dataset
        for req_elem in required_md_elems:
            if req_elem not in mdict:
                raise ValidationError('Dataset ' + file_base_name +
                                      ' does not have required metadata element: ' + req_elem)

    return first_data_row, mdict


def load_cell_data_csv_content(filename):
    data_str = ''
    cell_data_filename = os.path.join(settings.CELL_DATA_PATH, filename)
    if os.path.isfile(cell_data_filename):
        with open(cell_data_filename, 'r') as fp:
            # do data transpose before serving csv data to client
            file_base_name = os.path.basename(cell_data_filename)

            csv_data = csv.reader(fp)

            first_data_row, mdict = read_metadata_from_csv_data(file_base_name, csv_data)

            meta_dict = {file_base_name: mdict}

            if meta_dict[file_base_name]:
                # store meta_dict to database so that it is available for other requests
                if CellMetadata.objects.all().filter(cell_filename=file_base_name).exists():
                    # delete existing records to have updated record created subsequently
                    meta_rec = CellMetadata.objects.get(cell_filename=file_base_name)
                    meta_rec.metadata_dict = meta_dict[file_base_name]
                    meta_rec.save()
                else:
                    CellMetadata.objects.create(cell_filename=file_base_name,
                                                metadata_dict=meta_dict[file_base_name])

            data_list = [first_data_row] + [row for row in csv_data]

            for column in zip(*data_list):
                for y in column:
                    data_str += y + ','
                # replace last , with \n
                data_str = data_str[:-1]
                data_str += '\n'
    return file_base_name, data_str


def load_cell_data_csv(cell_data):
    file_base_name, csv_data_str = load_cell_data_csv_content(cell_data['fileName'].encode("utf-8"))
    data = {}
    data['fileName'] = file_base_name
    data['name'] = cell_data['name']
    data['description'] = cell_data['description']
    if 'timeUnit' in cell_data:
        data['timeUnit'] = cell_data['timeUnit']
    else:
        data['timeUnit'] = 'second'
    data['csv'] = csv_data_str

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
        if not name:
            name = id
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
            if not name:
                # use ID as name if name attribute is not available
                name=sp.getId()
            id = sp.getId()
            species_id_to_names[id] = name
            species_dict = {}
            species_dict['name'] = name
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
                    pname = param_list[0].getName()
                    if not pname:
                        pname = param_list[0].getId()
                    react_dict[pname] = param_list[0].getValue()
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
            pname = para.getName()
            if not pname:
                pname = para.getId()
            para_names = pname.split('_')
            name1 = para_names[1]
            if len(para_names) > 2:
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
                if p_s_s_matrix:
                    s_s_matrix.append(p_s_s_matrix)

        return_object['speciesMatrices'] = s_s_matrix

        jsondump = json.dumps(return_object)
        # logger.debug('info extracted from model: ' + jsondump)
        return jsondump
    except Exception as ex:
        return_object['error'] = ex.message
        jsondump = json.dumps(return_object)
        return jsondump


def load_model_content(filename):
    modelData = {}
    data = json.loads(extract_info_from_model(filename))
    modelData['species'] = data['species']
    modelData['phases'] = data['phases']
    modelData['speciesPhaseMatrix'] = data['speciesPhaseMatrix']
    modelData['speciesMatrices'] = data['speciesMatrices']
    modelData['reactions'] = data['reactions']

    return modelData


def load_model(model):
    modelData = load_model_content(model['fileName'])
    modelData['name'] = model['name']
    modelData['description'] = model['description']
    modelData['fileName'] = model['fileName']

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


def get_required_metadata_elements():
    dataset_config_name = "data/config/dataset_config.json"
    data = []
    with open(dataset_config_name, 'r') as md_config_file:
        config_data = json.load(md_config_file)
        if 'required_metadata_elements' in config_data:
            data = config_data['required_metadata_elements']
    return data


def get_all_cell_and_model_file_names(profiles=None):
    if not profiles:
        profiles = get_profile_list()
    cell_data_names = set()
    model_data_names = set()
    for p in profiles:
        if 'cellData' in p:
            for cd in p['cellData']:
                cell_data_names.add(cd['fileName'].encode("utf-8"))
        if 'models' in p:
            for md in p['models']:
                model_data_names.add(md['fileName'].encode("utf-8"))

    return cell_data_names, model_data_names


def get_dataset_list(profiles=None):
    if not profiles:
        profiles = get_profile_list()
    ds_list = []
    fn_list = []
    for p in profiles:
        if 'cellData' in p:
            for cd in p['cellData']:
                fn = cd['fileName'].encode("utf-8")
                if fn not in fn_list:
                    cd_dict = {}
                    cd_dict['filename'] = fn
                    cd_dict['id'] = fn
                    cd_dict['name'] = cd['name'].encode("utf-8")
                    cd_dict['description'] = cd['description'].encode("utf-8")
                    ds_list.append(cd_dict)
                    fn_list.append(fn)

    return ds_list


def get_model_list(profiles=None):
    if not profiles:
        profiles = get_profile_list()
    md_list = []
    fn_list = []
    for p in profiles:
        if 'models' in p:
            for md in p['models']:
                fn = md['fileName'].encode("utf-8")
                if fn not in fn_list:
                    md_dict = {}
                    md_dict['filename'] = fn
                    md_dict['id'] = fn
                    md_dict['name'] = md['name'].encode("utf-8")
                    md_dict['description'] = md['description'].encode("utf-8")
                    md_list.append(md_dict)
                    fn_list.append(fn)

    return md_list


def delete_profile(pname):
    profile_config_name = "data/config/profile_list.json"
    incl_cell_names = set()
    incl_model_names = set()
    with open(profile_config_name, 'r') as profile_config_file:
        config_data = json.load(profile_config_file)
        for pdata in config_data:
            p_filename = pdata['fileName']
            if os.path.isfile(p_filename):
                with open(p_filename, 'r') as profile_file:
                    data = json.load(profile_file)
                    if data['name'] == pname:
                        if 'cellData' in data:
                            for cd in data['cellData']:
                                incl_cell_names.add(cd['fileName'].encode("utf-8"))
                        if 'models' in data:
                            for md in data['models']:
                                incl_model_names.add(md['fileName'].encode("utf-8"))
                        # delete this profile
                        os.remove(p_filename)
                        config_data.remove(pdata)
                        break

    # update profile_list
    with open(profile_config_name, 'w') as f:
        f.write(json.dumps(config_data, indent=4))

    # delete cell data file and model data file if they are not used in other models
    cell_data_names, model_data_names = get_all_cell_and_model_file_names()
    for cd in incl_cell_names:
        if cd not in cell_data_names:
            cd_filename = os.path.join(settings.CELL_DATA_PATH, cd)
            os.remove(cd_filename)
    for md in incl_model_names:
        if md not in model_data_names:
            md_filename = os.path.join(settings.MODEL_INPUT_PATH, md)
            os.remove(md_filename)


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
        if not name:
            name = id
        id_to_names[id] = name
    paras = model.getListOfParameters()
    paras_list = []
    for para in paras:
        paras_dict = {}
        pname = para.getName()
        if not pname:
            pname = para.getId()
        paras_dict['name'] = pname
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
                pname = param_list[0].getName()
                if not pname:
                    pname = param_list[0].getId()
                react_dict['name'] = pname
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


# This function will spit out an SBML model with the appropriate number of subphases
# Follwing a sequential model where each subphase follows over each other
def createSBMLModel_CC_serial(num_G1, rate_G1, num_S, rate_S, num_G2M, rate_G2M, writesbmlfile):
    # Creating basic model
    model = simplesbml.sbmlModel(extent_units='item', sub_units='item')
    model.addCompartment(vol=1, comp_id='cell')

    is_G1_last = False
    is_S_last = False

    if num_G1 > 0 and num_S <= 0 and num_G2M <= 0:
        is_G1_last = True
    elif num_S > 0 and num_G2M <= 0:
        is_S_last = True

    # Create the first species G1_1 to initialize to 1, if num_G1 > 0
    if num_G1 > 0:
        model.addSpecies(species_id='G1', amt=0.0, comp='cell')
        model.addSpecies(species_id='G1_1', amt=1.0, comp='cell')

        # This will create all the species subphases for G1
        for i in range(2, num_G1 + 1):
            name_G1species = 'G1_' + str(i)
            if is_G1_last and i == num_G1:
                name_G1species += '_end'
            model.addSpecies(species_id=name_G1species, amt=0.0, comp='cell')

        # Create assignment rules for G1
        # If there is more than one sub-phase of G1, then concatenate G1_1 + G1_2 + ... and assign to rule
        if num_G1 > 1:
            con_G1 = ''
            for i in range(1, num_G1):
                con_G1 = con_G1 + ' G1_' + str(i) + ' +'
            rule_G1 = con_G1 + 'G1_' + str(num_G1)
            if is_G1_last:
                rule_G1 += '_end'
        # If there is only one sub-phase of G1, then rule is just G1 = G1_1
        else:
            rule_G1 = 'G1_1'
            if is_G1_last:
                rule_G1 += '_end'

        model.addAssignmentRule(var='G1', math=rule_G1)

        # Create parameters for rates of G1
        model.addParameter(param_id='r_G1', val=rate_G1)

    # This will create all the species subphases for S, if num_S > 0
    if num_S > 0:
        model.addSpecies(species_id='S', amt=0.0, comp='cell')

        # If no G1 subphases present, then first S_1 initialized to 1
        if num_G1 == 0:
            model.addSpecies(species_id='S_1', amt=1.0, comp='cell')
            s_S = 2
        # If there are G1 subphases present, then no S_1 initialization
        else:
            s_S = 1
        for i in range(s_S, num_S + 1):
            name_Sspecies = 'S_' + str(i)
            if is_S_last and i == num_S:
                name_Sspecies += '_end'
            model.addSpecies(species_id=name_Sspecies, amt=0.0, comp='cell')

        # Create assignment rules for S
        # If there is more than one sub-phase of S, then concatenate S_1 + S_2 + ... and assign to rule
        if num_S > 1:
            con_S = ''
            for i in range(1, num_S):
                con_S = con_S + ' S_' + str(i) + ' +'
            rule_S = con_S + 'S_' + str(num_S)
            if is_S_last:
                rule_S += '_end'
                # If there is only one sub-phase of S, then rule is just S = S_1
        else:
            rule_S = 'S_1'
            if is_S_last:
                rule_S += '_end'

        model.addAssignmentRule(var='S', math=rule_S)

        # Create parameters for rates of S
        model.addParameter(param_id='r_S', val=rate_S)

    # This will create all the species subphases for G2M
    if num_G2M > 0:
        model.addSpecies(species_id='G2M', amt=0.0, comp='cell')

        # If no G1 subphases present or S subphases present, first G2M_1 initialized to 1
        if num_G1 == 0 and num_S == 0:
            model.addSpecies(species_id='G2M_1', amt=1.0, comp='cell')
            s_G2M = 2
        # If there are G1 subphases present or S subphases present, no G2M_1 initialization
        else:
            s_G2M = 1
        for i in range(s_G2M, num_G2M + 1):
            name_G2Mspecies = 'G2M_' + str(i)
            if i == num_G2M:
                # the last sub-phase, append '_end' to signal to stochpy this is the last sub-phase
                name_G2Mspecies += '_end'
            model.addSpecies(species_id=name_G2Mspecies, amt=0.0, comp='cell')

        # Create assignment rules for G2M
        # If there is more than one sub-phase of G2M, then concatenate G2M_1 + G2M_2 + ... and assign to rule
        if num_G2M > 1:
            con_G2M = ''
            for i in range(1, num_G2M):
                con_G2M = con_G2M + ' G2M_' + str(i) + ' +'
            rule_G2M = con_G2M + 'G2M_' + str(num_G2M) + '_end'
        # If there is only one sub-phase of G2M, then rule is just G2M = G2M_1
        else:
            rule_G2M = 'G2M_1_end'

        model.addAssignmentRule(var='G2M', math=rule_G2M)

        # Create parameters for rates of G2M
        model.addParameter(param_id='r_G2M', val=rate_G2M)

    # Create reactions going from each subphase of G1 to the next
    for i in range(1, num_G1):
        r = 'G1_' + str(i)
        p = 'G1_' + str(i + 1)
        if is_G1_last and i == num_G1 - 1:
            p += '_end'
        exp = 'r_G1' + ' * ' + r
        id_for_rxn = r + '_to_' + p
        model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
    # Create rxn going from last G1 rxn to first S reaction, only if there are rxns present
    p_name = ''
    if num_G1 > 0:
        # Create last G1 subphase going to first S subphase only if S present
        if num_S > 0:
            if is_S_last and num_S == 1:
                p_name = 'S_1_end'
            else:
                p_name = 'S_1'
        # Create last G1 subphase going to first G2M subphase if no S present
        elif num_G2M > 0:
            if num_G2M == 1:
                p_name = 'G2M_1_end'
            else:
                p_name = 'G2M_1'
        # If no G2M or S subphases and there is more than one G1 subphase, go from last G1 subphase to G1_1
        elif num_G1 > 1:
            p_name = 'G1_1'
    if p_name:
        model.addReaction(reactants=['G1_' + str(num_G1)], products=[p_name],
                          expression='r_G1 * G1_' + str(num_G1),
                          rxn_id='G1_' + str(num_G1) + '_to_' + p_name)

    # Create reactions going from each subphase of S to the next
    for i in range(1, num_S):
        r = 'S_' + str(i)
        p = 'S_' + str(i + 1)
        if is_S_last and i == num_S - 1:
            p += '_end'
        exp = 'r_S' + ' * ' + r
        id_for_rxn = r + '_to_' + p
        model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
    # Create rxn going from last S rxn to first G2M reaction, only if S subphases exist
    if num_S > 0:
        # Create last S subphase going to first S subphase only if G2M present
        p_name = ''
        if num_G2M > 0:
            if num_G2M == 1:
                p_name = 'G2M_1_end'
            else:
                p_name = 'G2M_1'
        # Create last S subphase going to first G1 subphase since no G2M subphases present
        elif num_G1 > 0:
            p_name = 'G1_1'
        # If there are no G1 or G2M subphases, and there is more than one S subphase, go from last S subphase to S_1
        elif num_S > 1:
            p_name = 'S_1'

        if p_name:
            model.addReaction(reactants=['S_' + str(num_S)], products=[p_name],
                              expression='r_S * S_' + str(num_S),
                              rxn_id='S_' + str(num_S) + '_to_' + p_name)
    # Create reactions going from each subphase of G2M to the next
    for i in range(1, num_G2M):
        r = 'G2M_' + str(i)
        p = 'G2M_' + str(i + 1)
        if i == num_G2M - 1:
            p += '_end'
        exp = 'r_G2M' + ' * ' + r
        id_for_rxn = r + '_to_' + p
        model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)

    if num_G2M > 0:
        # Create rxn going from last G2M subphase back to first G1 reaction only if G1 subphases present
        r_name = 'G2M_' + str(num_G2M) + '_end'
        if num_G1 > 0:
            model.addReaction(reactants=[r_name], products=['G1_1'],
                              expression='r_G2M * G2M_' + str(num_G2M) + '_end',
                              rxn_id='G2M_' + str(num_G2M) + '_end_to_G1_1')
        # Create rxn going from last G2M subphase back to first S subphase if no G1 subphases present
        elif num_S > 0:
            model.addReaction(reactants=[r_name], products=['S_1'],
                              expression='r_G2M * G2M_' + str(num_G2M) + '_end',
                              rxn_id='G2M_' + str(num_G2M) + '_end_to_S_1')
        # Create rnx going from last G2M subphase back to first G2M subphase if no G1 or S subphases present
        elif num_G2M > 1:
            model.addReaction(reactants=[r_name], products=['G2M_1'],
                              expression='r_G2M * G2M_' + str(num_G2M) + '_end',
                              rxn_id='G2M_' + str(num_G2M) + '_end_to_G2M_1')

    # Convert code to an sbml and write sbml to a file
    sbml_to_write = model.toSBML()
    with open(writesbmlfile, 'w') as fw:
        fw.write(sbml_to_write)