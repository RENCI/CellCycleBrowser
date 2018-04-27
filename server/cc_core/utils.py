import json
import os
import zipfile
from shutil import make_archive
import csv
import re
from collections import OrderedDict

from libsbml import *

from django.conf import settings
from django.core.exceptions import ValidationError

from .models import CellMetadata


phases = ['G1', 'S', 'G2M']


def replace_func(matchObj):
    href_tag, url = matchObj.groups()
    if href_tag:
        # Since it has an href tag, this isn't what we want to change,
        # so return the whole match.
        return matchObj.group(0)
    else:
        return '<a href="{0}">{0}</a>'.format(url)


def read_metadata_from_csv_data(file_base_name, csv_data, required_md_elems=[]):
    mdict = OrderedDict()
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
            val = ''
            if len(row) >= 2:
                val = row[1]
                for idx in range(2, len(row)-1):
                    if row[idx]:
                        val += row[idx]
            key = key.strip()
            val = val.strip()
            if 'http://' in val or 'https://' in val:
                pattern = re.compile(
                    r'((?:<a href[^>]+>)|(?:<a href="))?'
                    r'((?:https?):(?:(?://)|(?:\\\\))+'
                    r"(?:[\w\d:#@%/;$()~_?\+\-=\\\.&](?:#!)?)*)",
                    flags=re.IGNORECASE
                )
                val = re.sub(pattern, replace_func, val)
            elif key.upper() == 'PMID' and val.isdigit():
                # make PMID clickable on metadata page
                val = 'https://www.ncbi.nlm.nih.gov/pubmed/' + val
                val = '<a href="{0}">{0}</a>'.format(val)
            mdict[key] = val

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


def zip_all_data(zip_path, zip_filename):
    ds_zip_file = os.path.join(zip_path, 'datasets')
    model_zip_file = os.path.join(zip_path, 'models')
    ds_path = os.path.join(zip_path, settings.CELL_DATA_PATH)
    model_path = os.path.join(zip_path, settings.MODEL_INPUT_PATH)

    make_archive(ds_zip_file, 'zip', ds_path)
    make_archive(model_zip_file, 'zip', model_path)

    model_zip_file += '.zip'
    ds_zip_file += '.zip'

    zip_path_file = os.path.join(zip_path, zip_filename)
    with zipfile.ZipFile(zip_path_file, 'w') as zfile:
        zfile.write(model_zip_file, 'models.zip')
        zfile.write(ds_zip_file, 'datasets.zip')

    # remove intermediate zip files
    os.remove(model_zip_file)
    os.remove(ds_zip_file)


# cell_data_filename input has to be the full path that can be directly opened by the server
def load_cell_data_csv_content(cell_data_filename):
    data_str = ''
    cell_data_filename = cell_data_filename.encode('utf-8')
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


def extract_species_and_phases_from_model(filename):
    """
    :param filename: the SBML model input file name
    :return: id_to_names, name_to_ids, species, phases quadruple where id_to_names is a dict that
             maps id to names for all species and phases and name_to_ids is a dict that maps names
             to ids for all species and phases; species is a list of pure species ids, and
             phases is a dict that has phases ids as keys and corresponding subphases ids list
             as values
    """
    model_file = filename.encode('utf-8')
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


# filename input parameter has to be full path so that it can be opened and read from the server
def extract_info_from_model(filename):
    """
    extract species, phases, speciesPhaseMatrix, and speciesMatrices info from the model file and
    return info as JSON string in the format of
    "species": [
      {
        "name": "53BP1",
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
        model_file = filename.encode('utf-8')
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
                p_sub_phases = []
                formula_str = rule.getFormula().strip()
                if formula_str:
                    formula_strs = formula_str.split('+')
                    for fstr in formula_strs:
                        fstr = fstr.strip()
                        sub_ph_name = species_id_to_names[fstr]
                        sub_phases.append(sub_ph_name)
                        p_sub_phases.append(sub_ph_name)
                phase['subphases'] = p_sub_phases
                phases.append(phase)

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

        # extract speciesPhaseMatrix and speciesMatrix
        species_name_list = [s['name'] for s in species_list]
        phase_name_list = [p['name'] for p in phases]
        # species_to_phase
        s_p_dict = OrderedDict()
        # species_to_species
        s_s_dict = OrderedDict()
        # species_to_species_over_a_phase
        p_s_s_dict = OrderedDict()

        species_species_phase_exist = False

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

        for pname in phase_name_list:
            s_s_dict = OrderedDict()
            for sname in species_name_list:
                s_dict = OrderedDict()
                for ssname in species_name_list:
                    s_dict[ssname] = 0
                s_s_dict[sname] = s_dict
            p_s_s_dict[pname] = s_s_dict

        paras = model.getListOfParameters()
        for para in paras:
            pname = para.getName()
            if not pname:
                pname = para.getId()
            para_names = pname.split('_')
            name0 = para_names[0].lower()
            name1 = para_names[1]
            if len(para_names) > 2:
                name2 = para_names[2]
                if len(para_names) > 3:
                    name3 = para_names[3]
                else:
                    name3 = ''
                if name0=='z':
                    # parameter is in format of z_species_species_phase
                    if name1 in species_name_list and \
                                    name2 in species_name_list and \
                                    name3 in phase_name_list:
                        p_s_s_dict[name3][name1][name2] = para.getValue()
                        species_species_phase_exist = True

                elif name0=='p':
                    # parameter is in format of p_species_phase
                    if name1 in species_name_list and name2 in phase_name_list:
                        s_p_dict[name1][name2] = para.getValue()

        s_p_matrix = []
        for s_name, s_value in s_p_dict.iteritems():
            p_list = []
            for p_name, p_value in s_value.iteritems():
                p_list.append(p_value)
            s_p_matrix.append(p_list)

        return_object['speciesPhaseMatrix'] = s_p_matrix

        s_s_matrix = []
        if species_species_phase_exist:
            for p_name, p_value in p_s_s_dict.iteritems():
                p_s_s_matrix = []
                for s_name, s_value in p_value.iteritems():
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
        return jsondumps


def load_model_content(filename):
    modelData = {}
    data = json.loads(extract_info_from_model(filename))
    modelData['species'] = data['species']
    modelData['phases'] = data['phases']
    modelData['speciesPhaseMatrix'] = data['speciesPhaseMatrix']
    modelData['speciesMatrices'] = data['speciesMatrices']

    return modelData


def load_model(model):
    modelData = load_model_content(model['fileName'])
    modelData['name'] = model['name']
    modelData['description'] = model['description']
    modelData['fileName'] = model['fileName']

    return modelData


def get_profile_list(profile_config_name=None):
    if not profile_config_name:
        profile_config_name = os.path.join(settings.WORKSPACE_PATH, settings.WORKSPACE_CONFIG_PATH,
                                           settings.WORKSPACE_CONFIG_FILENAME)
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
    dataset_config_name = os.path.join(settings.WORKSPACE_PATH, settings.WORKSPACE_CONFIG_PATH,
                                       settings.DATASET_CONFIG_NAME)
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
                    cd_dict['fileName'] = fn
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
                    md_dict['fileName'] = fn
                    md_dict['id'] = fn
                    md_dict['name'] = md['name'].encode("utf-8")
                    md_dict['description'] = md['description'].encode("utf-8")
                    md_list.append(md_dict)
                    fn_list.append(fn)

    return md_list


def delete_profile(pname):
    profile_config_name = os.path.join(settings.WORKSPACE_PATH, settings.WORKSPACE_CONFIG_PATH, settings.WORKSPACE_CONFIG_FILENAME)
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
            cd_filename = os.path.join(settings.WORKSPACE_PATH, settings.CELL_DATA_PATH, cd)
            os.remove(cd_filename)
    for md in incl_model_names:
        if md not in model_data_names:
            md_filename = os.path.join(settings.WORKSPACE_PATH, settings.MODEL_INPUT_PATH, md)
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


def extract_parameter_ids(filename):
    model_file = filename.encode("utf-8")
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
    para_ids_list = []
    for para in paras:
        para_ids_list.append(para.getId())
    return para_ids_list


def extract_parameters(filename):
    model_file = filename
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


# define functions
def create_species(model=None, species_id='', amt=0.0, comp='cell'):
    if not model or not species_id:
        return

    s1 = model.createSpecies()
    s1.setId(species_id)
    s1.setCompartment(comp)
    s1.setInitialAmount(amt)
    s1.setSubstanceUnits(model.getSubstanceUnits())
    s1.setBoundaryCondition(False)
    s1.setConstant(False)
    s1.setHasOnlySubstanceUnits(False)
    return s1


def add_reaction(model=None, reactants=[], products=[], modifiers=[], expression='', local_para={},
                 rxn_id=''):
    if not model:
        return

    r1 = model.createReaction()
    if not rxn_id:
        rxn_id = 'v' + str(model.getNumReactions())
    r1.setId(rxn_id)
    r1.setReversible(False)
    r1.setFast(False)

    for rea in reactants:
        re_split = rea.split()
        if len(re_split) == 1:
            sto = 1.0
            re_id = rea
        elif len(re_split) == 2 and re_split[0].isdigit():
            sto = float(re_split[0])
            re_id = re_split[1]
        else:
            err_msg = 'Error: reactants must be listed in format \'S\' or \'(float)\' S\''
            raise SystemExit(err_msg)
        s1 = model.getSpecies(re_id)
        species_ref1 = r1.createReactant()
        species_ref1.setSpecies(str(s1)[9:len(str(s1)) - 1])
        species_ref1.setStoichiometry(sto)
        species_ref1.setConstant(True)

    for pro in products:
        pro_split = pro.split()
        if len(pro_split) == 1:
            sto = 1.0
            pro_id = pro
        elif len(pro_split) == 2:
            sto = float(pro_split[0])
            pro_id = pro_split[1]
        else:
            err_msg = 'Error: products must be listed in format \'S\' or \'(float)\' S\''
            raise SystemExit(err_msg)
        s2 = model.getSpecies(pro_id)
        species_ref2 = r1.createProduct()
        species_ref2.setSpecies(str(s2)[9:len(str(s2)) - 1])
        species_ref2.setStoichiometry(sto)
        species_ref2.setConstant(True)

    for mod in modifiers:
            mod_ref = r1.createModifier()
            s3 = model.getSpecies(mod)
            mod_ref.setSpecies(str(s3)[9:len(str(s3)) - 1])

    math_ast = parseL3Formula(expression)
    kinetic_law = r1.createKineticLaw()
    for key, val in local_para.iteritems():
        p = kinetic_law.createLocalParameter()
        p.setId(key)
        p.setValue(val)

    kinetic_law.setMath(math_ast)

    if type(r1) is int:
        if r1 != LIBSBML_OPERATION_SUCCESS:
            print str(r1) + ':' + OperationReturnValue_toString(r1).strip()
    elif not r1:
        print "Reaction is not created for phase transition from " + str(r1) + " to " + str(p)

    return r1


def add_reaction_from_phase_to_next(model=None, phase='', num_phases=[], exp='', local_para=[]):
    if not model or not phase or not num_phases or not exp:
        return
    phase_idx = -1
    for i in range(len(phases)):
        if phase == phases[i]:
            phase_idx = i
            break
    # reaction can only be added for the first two phases going to the next
    if phase_idx != 0 and phase_idx != 1:
        return
    phase_next_idx = phase_idx + 1
    sub_phase_name = phase + '_' + str(num_phases[phase_idx])
    next_sub_phase_name = ''
    if phase_next_idx == 2 and num_phases[phase_next_idx] == 1:
        next_sub_phase_name = str(phases[phase_next_idx]) + '_1_end'
    elif num_phases[phase_next_idx] > 0:
        next_sub_phase_name = str(phases[phase_next_idx]) + '_1'
    if not next_sub_phase_name:
        return

    # create last subphase going to next phase subphase
    add_reaction(model, reactants=[sub_phase_name], products=[next_sub_phase_name],
                 expression=exp, local_para=local_para,
                 rxn_id=sub_phase_name+'_to_'+next_sub_phase_name)


# create an SBML model with the appropriate number of subphases Follwing a sequential model
# where each subphase follows over each other according to the input specification above
def createSBMLModel_CC_serial(num_G1, rate_G1, num_S, rate_S, num_G2M, rate_G2M, outputsbmlfile):
    num_phases = [num_G1, num_S, num_G2M]
    rate_phases = [rate_G1, rate_S, rate_G2M]

    species_list = ["PCNA","p53BP1","p21"]
    X0 = [10,20,10]
    P = [
        [0, 0, 0],
        [0, 0, 0],
        [0.3, 0, 0.3]
    ]
    B = [
        [3, 15, 6],
        [10, 6, 3],
        [5, 5, 5]
    ]
    A = [
        [.3, .3, .6],
        [.2, .6, .3],
        [.5, .05, .05]
    ]
    Z = [
        [
            [0, 0, 0],
            [0, 0.5, 0],
            [0, 0, 0]
        ],
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        [
            [0, 0, 0],
            [0, 0.3, 0],
            [0, 0, 0]
        ]
    ]

    # Creating basic model
    try:
        document = SBMLDocument(3, 1)
    except ValueError:
        raise SystemExit('Could not create SBMLDocumention object')

    model = document.createModel()
    model.setTimeUnits('second')
    model.setExtentUnits('item')
    model.setSubstanceUnits('item')

    # Create a compartment inside this model, and set the required
    # attributes for an SBML compartment in SBML Level 3.

    c1 = model.createCompartment()
    c1.setId('cell')
    c1.setConstant(True)
    c1.setSize(1)

    if species_list and X0:
        if len(species_list) == len(X0):
            for i in range(len(species_list)):
                create_species(model=model, species_id=str(species_list[i]), amt=X0[i])

    is_G1_last = False
    is_S_last = False

    if num_G1 > 0 and num_S <= 0 and num_G2M <= 0:
        is_G1_last = True
    elif num_S > 0 and num_G2M <= 0:
        is_S_last = True

    # Create the first species G1_1 to initialize to 1, if num_G1 > 0
    if num_G1 > 0:
        create_species(model=model, species_id='G1', amt=0.0)
        create_species(model=model, species_id='G1_1', amt=1.0)

        # This will create all the species subphases for G1
        for i in range(2, num_G1 + 1):
            name_G1species = 'G1_' + str(i)
            if is_G1_last and i == num_G1:
                name_G1species += '_end'
            create_species(model=model, species_id=name_G1species, amt=0.0)

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

        r = model.createAssignmentRule()
        r.setVariable('G1')
        math_ast = parseL3Formula(rule_G1)
        r.setMath(math_ast)

    # This will create all the species subphases for S, if num_S > 0
    if num_S > 0:
        create_species(model=model, species_id='S', amt=0.0)

        # If no G1 subphases present, then first S_1 initialized to 1
        if num_G1 == 0:
            create_species(model=model, species_id='S_1', amt=1.0)
            s_S = 2
        # If there are G1 subphases present, then no S_1 initialization
        else:
            s_S = 1
        for i in range(s_S, num_S + 1):
            name_Sspecies = 'S_' + str(i)
            if is_S_last and i == num_S:
                name_Sspecies += '_end'
            create_species(model=model, species_id=name_Sspecies, amt=0.0)

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

        r = model.createAssignmentRule()
        r.setVariable('S')
        math_ast = parseL3Formula(rule_S)
        r.setMath(math_ast)

    # This will create all the species subphases for G2M
    if num_G2M > 0:
        create_species(model=model, species_id='G2M', amt=0.0)

        # If no G1 subphases present or S subphases present, first G2M_1 initialized to 1
        if num_G1 == 0 and num_S == 0:
            create_species(model=model, species_id='G2M_1', amt=1.0)
            s_G2M = 2
        # If there are G1 subphases present or S subphases present, no G2M_1 initialization
        else:
            s_G2M = 1
        for i in range(s_G2M, num_G2M + 1):
            name_G2Mspecies = 'G2M_' + str(i)
            if i == num_G2M:
                # the last sub-phase, append '_end' to signal to stochpy this is the last sub-phase
                name_G2Mspecies += '_end'
            create_species(model=model, species_id=name_G2Mspecies, amt=0.0)

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

        r = model.createAssignmentRule()
        r.setVariable('G2M')
        math_ast = parseL3Formula(rule_G2M)
        r.setMath(math_ast)

    # create species to phase parameters and reactions based on input P
    for ph_idx in range(len(phases)):
        for sp_idx in range(len(P)):
            sp_ph_list = P[sp_idx]
            sp_ph_val = sp_ph_list[ph_idx]
            # create parameter for species to phase interaction value
            pid = 'p_' + species_list[sp_idx] + '_' + phases[ph_idx]
            k = model.createParameter()
            k.setId(str(pid))
            k.setConstant(False)
            k.setValue(sp_ph_val)
            k.setUnits('per_second')

        # create parameters for rates of the phase
        rid = 'r_' + phases[ph_idx]
        # add reactions for phase transition resulting from this species-phase interaction
        # Create reactions going from each subphase of G1 to the next based on input P
        for i in range(1, num_phases[ph_idx]):
            r = phases[ph_idx] + '_' + str(i)
            p = phases[ph_idx] + '_' + str(i + 1)
            if phases[ph_idx] == 'G2M' and i == num_phases[ph_idx] - 1:
                p += '_end'

            exp = rid + ' * ' + r
            for sp_idx in range(len(P)):
                pid = 'p_' + species_list[sp_idx] + '_' + phases[ph_idx]
                exp += ' * power(1+' + str(species_list[sp_idx]) + ',' + pid + ')'
            id_for_rxn = r + '_to_' + p
            add_reaction(model=model, reactants=[r], products=[p],
                         expression=str(exp), local_para={str(rid): rate_phases[ph_idx]},
                         rxn_id=id_for_rxn)

        if ph_idx == 0 or ph_idx == 1:
            r = phases[ph_idx] + '_' + str(num_phases[ph_idx])
            exp = rid + ' * ' + r
            for sp_idx in range(len(P)):
                pid = 'p_' + species_list[sp_idx] + '_' + phases[ph_idx]
                exp += ' * power(1+' + str(species_list[sp_idx]) + ',' + pid + ')'
            add_reaction_from_phase_to_next(model=model, phase=phases[ph_idx],
                                            num_phases=num_phases, exp=str(exp),
                                            local_para={str(rid): rate_phases[ph_idx]})
        elif ph_idx == 2:
            # create reaction from the last subphase to null to end the whole cell cycle
            last_phase_id = phases[ph_idx] + '_' + str(num_phases[ph_idx]) + '_end'
            exp = rid + ' * ' + last_phase_id
            for sp_idx in range(len(P)):
                pid = 'p_' + species_list[sp_idx] + '_' + phases[ph_idx]
                exp += ' * power(1+' + str(species_list[sp_idx]) + ',' + pid + ')'
            id_for_rxn = last_phase_id + '_to_end_cycle'
            add_reaction(model=model, reactants=[last_phase_id], products=[], expression=str(exp),
                         local_para={str(rid): rate_phases[ph_idx]},
                         rxn_id=id_for_rxn)

    # For each species, generate a production reaction based on input B
    for sp_idx in range(len(B)):
        sp_ph_list = B[sp_idx]
        si = species_list[sp_idx]
        exp = ''
        para_dict = {}
        for ph_idx in range(len(sp_ph_list)):
            # create parameter for bij
            pid = 'b_' + species_list[sp_idx] + '_' + phases[ph_idx]
            k = model.createParameter()
            k.setId(str(pid))
            k.setConstant(False)
            k.setValue(sp_ph_list[ph_idx])
            k.setUnits('per_second')
            if exp:
                exp += ' + '
            if phases[ph_idx] == 'G1':
                exp += pid + ' * ' + '(' + rule_G1 + ')'
            elif phases[ph_idx] == 'S':
                exp += pid + ' * ' + '(' + rule_S + ')'
            elif phases[ph_idx] == 'G2M':
                exp += pid + ' * ' + '(' + rule_G2M + ')'
        id_for_rxn = 'synthesis_' + str(si)

        r = add_reaction(model=model, products=[str(si)],
                         expression=str(exp),
                         rxn_id=id_for_rxn)
        if type(r) is int:
            if r != LIBSBML_OPERATION_SUCCESS:
                print str(r) + ':' + OperationReturnValue_toString(r).strip()
        elif not r:
            print "Reaction is not created for production reaction based on input B"

    # For each species, generate a degradation reaction based on input A
    for sp_idx in range(len(A)):
        para_dict = {}
        sp_ph_list = A[sp_idx]
        si = species_list[sp_idx]
        exp = ''
        for ph_idx in range(len(sp_ph_list)):
            # create parameter for aij
            pid = 'a_' + species_list[sp_idx] + '_' + phases[ph_idx]
            k = model.createParameter()
            k.setId(str(pid))
            k.setConstant(False)
            k.setValue(sp_ph_list[ph_idx])
            k.setUnits('per_second')
            if exp:
                exp += ' + '
            if phases[ph_idx] == 'G1':
                exp += pid + ' * ' + '(' + rule_G1 + ')' + ' * ' + str(si)
            elif phases[ph_idx] == 'S':
                exp += pid + ' * ' + '(' + rule_S + ')' + ' * ' + str(si)
            elif phases[ph_idx] == 'G2M':
                exp += pid + ' * ' + '(' + rule_G2M + ')' + ' * ' + str(si)
        id_for_rxn = 'degradation_' + str(si)
        #    r = add_reaction(model=model, reactants=[str(si)], modifiers=phases,
        r = add_reaction(model=model, reactants=[str(si)],
                         expression=str(exp), rxn_id=id_for_rxn)
        if type(r) is int:
            if r != LIBSBML_OPERATION_SUCCESS:
                print str(r) + ':' + OperationReturnValue_toString(r).strip()
        elif not r:
            print "Reaction is not created for degradation reaction based on input A"

    # generate species-species interaction over each phase based on input Z
    for i in range(len(Z)):
        i_list = Z[i]
        si = species_list[i]
        for j in range(len(i_list)):
            # do not need to handle interaction between a species to itself
            if j == i:
                continue
            j_list = i_list[j]
            sj = species_list[j]
            for k in range(len(j_list)):
                Zijk = j_list[k]
                # create parameter for zijk
                pid = 'z_' + str(si) + '_' + str(sj) + '_' + str(phases[k])
                pk = model.createParameter()
                pk.setId(str(pid))
                pk.setConstant(False)
                pk.setValue(Zijk)
                pk.setUnits('per_second')
                if Zijk > 0:
                    # create production reaction
                    exp = pid + ' * ' + str(si)
                    id_for_rxn = 'synthesis_' + str(si) + '_' + str(sj) + '_' + str(phases[k])
                    add_reaction(model=model, products=[str(sj)], modifiers=[str(si)],
                                 expression=str(exp), rxn_id=id_for_rxn)
                elif Zijk < 0:
                    # create degration reaction
                    exp = pid + ' * ' + str(si) + ' * ' + str(sj)
                    id_for_rxn = 'degradation_' + str(si) + '_' + \
                                 str(sj) + '_' + str(phases[k])
                    add_reaction(model=model, reactants=[str(sj)], modifiers=[str(si)],
                                 expression=str(exp), rxn_id=id_for_rxn)

    # write sbml to a file
    writeSBML(document, outputsbmlfile.encode('utf-8'))
