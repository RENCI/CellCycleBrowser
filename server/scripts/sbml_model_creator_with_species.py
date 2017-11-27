# This script creates SBML model for Cell Cycle Browser based on an input JSON file that specifies
# various parameters for species and interactions. An input.json file is also in the repo for
# an example input file template that can be modified to create different SBML models

import sys
import json
from libsbml import *

phases = ['G1', 'S', 'G2M']

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

    for re in reactants:
        re_split = re.split()
        if len(re_split) == 1:
            sto = 1.0
            re_id = re
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
        print "Reaction is not created for phase transition from " + r + " to " + p

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


# This function will output an SBML model with the appropriate number of subphases
# Follwing a sequential model where each subphase follows over each other
# X0 is the list of species initial condition values corresponding to species_list
# P contains an array of nxm species-phase interaction stregths in list,
# B contains an array of nxm production rates in list,
# A contains an array of nxm degradation rates in list,
# Z contains an array of nxnxm species interactions in list,
# where n is the number of species and m is the number of phases, currently 3, i.e., G1, S, G2M
def createSBMLModel_CC_serial(num_G1, rate_G1, num_S, rate_S, num_G2M, rate_G2M, species_list, X0,
                              P, B, A, Z, writesbmlfile):
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

    num_phases = [num_G1, num_S, num_G2M]
    rate_phases = [rate_G1, rate_S, rate_G2M]

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

        #If no G1 subphases present or S subphases present, first G2M_1 initialized to 1
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
            pid = 'a_' + species_list[sp_idx] + '_' + phases[ph_idx]
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
                pid = 'a_' + species_list[sp_idx] + '_' + phases[ph_idx]
                exp += ' * power(1+' + str(species_list[sp_idx]) + ',' + pid + ')'
            id_for_rxn = r + '_to_' + p
            add_reaction(model=model, reactants=[r], products=[p],
                             expression=str(exp), local_para={str(rid): rate_phases[ph_idx]},
                             rxn_id=id_for_rxn)

        if ph_idx == 0 or ph_idx == 1:
            r = phases[ph_idx] + '_' + str(num_phases[ph_idx])
            exp = rid + ' * ' + r
            for sp_idx in range(len(P)):
                pid = 'a_' + species_list[sp_idx] + '_' + phases[ph_idx]
                exp += ' * power(1+' + str(species_list[sp_idx]) + ',' + pid + ')'
            add_reaction_from_phase_to_next(model=model, phase=phases[ph_idx],
                                            num_phases=num_phases, exp=str(exp),
                                            local_para={str(rid): rate_phases[ph_idx]})
        elif ph_idx == 2:
            # create reaction from the last subphase to null to end the whole cell cycle
            last_phase_id = phases[ph_idx] + '_' + str(num_phases[ph_idx]) + '_end'
            exp = rid + ' * ' + last_phase_id
            for sp_idx in range(len(P)):
                pid = 'a_' + species_list[sp_idx] + '_' + phases[ph_idx]
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
            para_dict[str(pid)] = sp_ph_list[ph_idx]
            if exp:
                exp += ' + '
            if phases[ph_idx] == 'G1':
                exp += pid + ' * ' + '(' + rule_G1 + ')'
            elif phases[ph_idx] == 'S':
                exp += pid + ' * ' + '(' + rule_S + ')'
            elif phases[ph_idx] == 'G2M':
                exp += pid + ' * ' + '(' + rule_G2M + ')'
            else:
                exp += pid + ' * ' + str(phases[ph_idx])
        id_for_rxn = 'synthesis_' + str(si)

        r = add_reaction(model=model, products=[str(si)], modifiers=phases,
                         expression=str(exp), local_para=para_dict,
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
            para_dict[str(pid)] = sp_ph_list[ph_idx]
            if exp:
                exp += ' + '
            if phases[ph_idx] == 'G1':
                exp += pid + ' * ' + '(' + rule_G1 + ')' + ' * ' + str(si)
            elif phases[ph_idx] == 'S':
                exp += pid + ' * ' + '(' + rule_S + ')' + ' * ' + str(si)
            elif phases[ph_idx] == 'G2M':
                exp += pid + ' * ' + '(' + rule_G2M + ')' + ' * ' + str(si)
            else:
                exp += pid + ' * ' + str(phases[ph_idx]) + ' * ' + str(si)
        id_for_rxn = 'degradation_' + str(si)
        r = add_reaction(model=model, reactants=[str(si)], modifiers=phases,
                         expression=str(exp), local_para=para_dict, rxn_id=id_for_rxn)
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
                pid = 'a_' + str(si) + '_' + str(sj) + '_' + str(phases[k])
                k = model.createParameter()
                k.setId(str(pid))
                k.setConstant(False)
                k.setValue(Zijk)
                k.setUnits('per_second')
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
                                 expression=str(exp),rxn_id=id_for_rxn)

    # write sbml to a file
    writeSBML(document, str(writesbmlfile))


if len(sys.argv) <= 1:
    print "An JSON input file name must be passed in as the first parameter."
    exit(1)

input_file_name = sys.argv[1].strip()
with open(input_file_name, 'r') as input_file:
    data = json.load(input_file)
    createSBMLModel_CC_serial(data['k_G1'], data['lambda_G1'], data['k_S'], data['lambda_S'],
                              data['k_G2'], data['lambda_G2'], data['Species'], data['X0'],
                              data['P'], data['B'], data['A'], data['Z'],
                              data['output_file_name'])