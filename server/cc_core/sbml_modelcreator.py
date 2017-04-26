import simplesbml


# This function will spit out an SBML model with the appropriate number of subphases
# Follwing a sequential model where each subphase follows over each other
def createSBMLModel_CC_serial(num_G1, rate_G1, num_S, rate_S, num_G2M, rate_G2M, writesbmlfile):

    # Creating basic model
    model = simplesbml.sbmlModel(extent_units='item', sub_units='item')
    model.addCompartment(vol=1, comp_id='cell')

    # Create the first species G1_1 to initialize to 1, if num_G1 > 0
    if num_G1 > 0:
        model.addSpecies(species_id='G1', amt=0.0, comp='cell')
        model.addSpecies(species_id='G1_1', amt=1.0, comp='cell')

        # This will create all the species subphases for G1
        for i in range(2, num_G1 + 1):
            name_G1species = 'G1_' + str(i)
            model.addSpecies(species_id=name_G1species, amt=0.0, comp='cell')

        # Create assignment rules for G1
        # If there is more than one sub-phase of G1, then concatenate G1_1 + G1_2 + ... and assign to rule
        if num_G1 > 1:
            con_G1 = ''
            for i in range(1, num_G1):
                con_G1 = con_G1 + ' G1_' + str(i) + ' +'
            rule_G1 = con_G1 + 'G1_' + str(num_G1)
        # If there is only one sub-phase of G1, then rule is just G1 = G1_1
        else:
            rule_G1 = 'G1_1'
        model.addAssignmentRule(var='G1', math=rule_G1)

        # Create parameters for rates of G1
        model.addParameter(param_id='r_53BP1_G1', val=rate_G1)

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
            model.addSpecies(species_id=name_Sspecies, amt=0.0, comp='cell')

        # Create assignment rules for S
        # If there is more than one sub-phase of S, then concatenate S_1 + S_2 + ... and assign to rule
        if num_S > 1:
            con_S = ''
            for i in range(1, num_S):
                con_S = con_S + ' S_' + str(i) + ' +'
            rule_S = con_S + 'S_' + str(num_S)
            # If there is only one sub-phase of S, then rule is just S = S_1
        else:
            rule_S = 'S_1'
        
        model.addAssignmentRule(var='S', math=rule_S)

        # Create parameters for rates of S
        model.addParameter(param_id='r_53BP1_S', val=rate_S)

    # This will create all the species subphases for G2M
    if num_G2M > 0:
        model.addSpecies(species_id='G2M', amt=0.0, comp='cell')

        #If no G1 subphases present or S subphases present, first G2M_1 initialized to 1
        if num_G1 == 0 and num_S == 0:
            model.addSpecies(species_id='G2M_1', amt=1.0, comp='cell')
            s_G2M = 2
        # If there are G1 subphases present or S subphases present, no G2M_1 initialization
        else:
            s_G2M = 1
        for i in range(s_G2M, num_G2M + 1):
            name_G2Mspecies = 'G2M_' + str(i)
            model.addSpecies(species_id=name_G2Mspecies, amt=0.0, comp='cell')

        # Create assignment rules for G2M
        # If there is more than one sub-phase of G2M, then concatenate G2M_1 + G2M_2 + ... and assign to rule
        if num_G2M > 1:
            con_G2M = ''
            for i in range(1, num_G2M):
                con_G2M = con_G2M + ' G2M_' + str(i) + ' +'
            rule_G2M = con_G2M + 'G2M_' + str(num_G2M)
        # If there is only one sub-phase of G2M, then rule is just G2M = G2M_1
        else:
            rule_G2M = 'G2M_1'
        
        model.addAssignmentRule(var='G2M', math=rule_G2M)

        # Create parameters for rates of G2M
        model.addParameter(param_id='r_53BP1_G2M', val=rate_G2M)


    # Create reactions going from each subphase of G1 to the next
    for i in range(1, num_G1):
        r = 'G1_' + str(i)
        p = 'G1_' + str(i + 1)
        exp = 'r_53BP1_G1' + ' * ' + r
        id_for_rxn = r + '_to_' + p
        model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
    # Create rxn going from last G1 rxn to first S reaction, only if there are rxns present
    if num_G1 > 0:
        # Create last G1 subphase going to first S subphase only if S present
        if num_S >0:
            model.addReaction(reactants=['G1_' + str(num_G1)], products=['S_1'],
                    expression='r_53BP1_G1 * G1_' + str(num_G1), rxn_id='G1_' + str(num_G1) + '_to_S_1')
        # Create last G1 subphase going to first G2M subphase if no S present
        elif num_G2M >0:
            model.addReaction(reactants=['G1_' + str(num_G1)], products=['G2M_1'],
                          expression='r_53BP1_G1 * G1_' + str(num_G1), rxn_id='G1_' + str(num_G1) + '_to_G2M_1')
        # If no G2M or S subphases and there is more than one G1 subphase, go from last G1 subphase to G1_1
        elif num_G1 > 1:
            model.addReaction(reactants=['G1_' + str(num_G1)], products=['G1_1'],
                              expression='r_53BP1_G1 * G1_' + str(num_G1), rxn_id='G1_' + str(num_G1) + '_to_G1_1')

    # Create reactions going from each subphase of S to the next
    for i in range(1, num_S):
        r = 'S_' + str(i)
        p = 'S_' + str(i + 1)
        exp = 'r_53BP1_S' + ' * ' + r
        id_for_rxn = r + '_to_' + p
        model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
    # Create rxn going from last S rxn to first G2M reaction, only if S subphases exist
    if num_S > 0:
        # Create last S subphase going to first S subphase only if G2M present
        if num_G2M > 0:
            model.addReaction(reactants=['S_' + str(num_S)], products=['G2M_1'],
                            expression='r_53BP1_S * S_' + str(num_S),rxn_id='S_' + str(num_S) + '_to_G2M_1')
        # Create last S subphase going to first G1 subphase since no G2M subphases present
        elif num_G1 > 0:
            model.addReaction(reactants=['S_' + str(num_S)], products=['G1_1'],
                              expression='r_53BP1_S * S_' + str(num_S), rxn_id='S_' + str(num_S) + '_to_G1_1')
        # If there are no G1 or G2M subphases, and there is more than one S subphase, go from last S subphase to S_1
        elif num_S > 1:
            model.addReaction(reactants=['S_' + str(num_S)], products=['S_1'],
                              expression='r_53BP1_S * S_' + str(num_S), rxn_id='S_' + str(num_S) + '_to_S_1')

    # Create reactions going from each subphase of G2M to the next
    for i in range(1, num_G2M):
        r = 'G2M_' + str(i)
        p = 'G2M_' + str(i + 1)
        exp = 'r_53BP1_G2M' + ' * ' + r
        id_for_rxn = r + '_to_' + p
        model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)

    if num_G2M > 0:
        # Create rxn going from last G2M subphase back to first G1 reaction only if G1 subphases present
        if num_G1 > 0:
            model.addReaction(reactants=['G2M_' + str(num_G2M)], products=['G1_1'],
                    expression='r_53BP1_G2M * G2M_' + str(num_G2M), rxn_id='G2M_' + str(num_G2M) + '_to_G1_1')
        # Create rxn going from last G2M subphase back to first S subphase if no G1 subphases present
        elif num_S > 0:
            model.addReaction(reactants=['G2M_' + str(num_G2M)], products=['S_1'],
                    expression='r_53BP1_G2M * G2M_' + str(num_G2M), rxn_id='G2M_' + str(num_G2M) + '_to_S_1')
        # Create rnx going from last G2M subphase back to first G2M subphase if no G1 or S subphases present
        elif num_G2M > 1:
            model.addReaction(reactants=['G2M_' + str(num_G2M)], products=['G2M_1'],
                    expression='r_53BP1_G2M * G2M_' + str(num_G2M), rxn_id='G2M_' + str(num_G2M) + '_to_G2M_1')

    # Convert code to an sbml and write sbml to a file
    sbml_to_write = model.toSBML()
    with open(writesbmlfile, 'w') as fw:
        fw.write(sbml_to_write)


# This function will spit out an SBML model with the appropriate number of subphases
# Follwing a parallel model where we wait for all subphases to finish in parallel before
# moving on to the next phase
def createSBMLModel_CC_parallel(num_G1, rate_G1, num_S, rate_S, num_G2M, rate_G2M, writesbmlfile):

    # Creating basic model
    model = simplesbml.sbmlModel(extent_units='item', sub_units='item',level=2,version=4)
    model.addCompartment(vol=1, comp_id='cell')

    # Create the species G1_i_0 to initialize to 1, if num_G1 > 0
    # Create the species G1_i_1 to initialize to 0, if num_G1 > 0
    if num_G1 > 0:
        model.addSpecies(species_id='G1', amt=0.0, comp='cell')
        
        con_G1 = ''
        for i in range(1, num_G1 + 1):
            name_G1species = 'G1_' + str(i)
            model.addSpecies(species_id=name_G1species+'_0', amt=1.0, comp='cell')
            model.addSpecies(species_id=name_G1species+'_1', amt=0.0, comp='cell')
            
            # Create reactions going from G1_i_0 to G1_i_1
            r = 'G1_' + str(i) + '_0'
            p = 'G1_' + str(i) + '_1'
            exp = 'r_53BP1_G1' + ' * ' + r
            id_for_rxn = r + '_to_' + p
            model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
            
            # Create assignment rules for G1
            # If there is more than one sub-phase of G1, then 
            # concatenate G1_1 + G1_2 + ... and assign to rule
            # Make sure you don't add last subphase to rule
            if num_G1 > 1 and i!=num_G1:
                con_G1 = con_G1 + ' G1_' + str(i) + '_0 +'
            
        # If there is more than one sub-phase of G1, after for loop, we are 
        # just adding the last subphase to the rule
        if num_G1 > 1:
            rule_G1 = con_G1 + 'G1_' + str(num_G1) + '_0'
        # If there is only one sub-phase of G1, then rule is just G1 = G1_1
        else:
            rule_G1 = 'G1_1_0'
        model.addAssignmentRule(var='G1', math=rule_G1)

        # Create parameters for rates of G1
        model.addParameter(param_id='r_53BP1_G1', val=rate_G1)

    # Create the species G1_i_0 to initialize to 1, if num_G1 > 0
    # Create the species G1_i_1 to initialize to 0, if num_G1 > 0
    if num_S > 0:
        model.addSpecies(species_id='S', amt=0.0, comp='cell')

        # If no G1 subphases present, then all S_i_0 initalized to 1
        if num_G1 == 0:
            c_S = 1.0
        # If there are G1 subphases present, then  S_i_0 initalized to 0
        else:
            c_S = 0.0
        
        con_S = ''
        for i in range(1, num_S + 1):
            name_Sspecies = 'S_' + str(i)
            model.addSpecies(species_id=name_Sspecies+'_0', amt=c_S, comp='cell')
            model.addSpecies(species_id=name_Sspecies+'_1', amt=0.0, comp='cell')
            
            # Create reactions going from S_i_0 to S_i_1
            r = 'S_' + str(i) + '_0'
            p = 'S_' + str(i) + '_1'
            exp = 'r_53BP1_S' + ' * ' + r
            id_for_rxn = r + '_to_' + p
            model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
            
            # Create assignment rules for S
            # If there is more than one sub-phase of S, then 
            # concatenate S_1 + S_2 + ... and assign to rule
            # Make sure you don't add last subphase to rule
            if num_S > 1 and i!=num_S:
                con_S = con_S + ' S_' + str(i) + '_0 +'
            
            
        # If there is more than one sub-phase of S, after for loop, we are 
        # just adding the last subphase to the rule
        if num_S > 1:
            rule_S = con_S + 'S_' + str(num_S) + '_0'
        # If there is only one sub-phase of S, then rule is just S = S_1
        else:
            rule_S = 'S_1_0'
        model.addAssignmentRule(var='S', math=rule_S)

        # Create parameters for rates of S
        model.addParameter(param_id='r_53BP1_S', val=rate_S)

    # This will create all the species subphases for G2M
    if num_G2M > 0:
        model.addSpecies(species_id='G2M', amt=0.0, comp='cell')

        #If no G1 subphases present or S subphases present, G2M_i_0 initialized to 1
        if num_G1 == 0 and num_S == 0:
            c_G2M = 1.0
        # If there are G1 subphases present or S subphases present, G2M_i_0 initialized to 0
        else:
            c_G2M = 0.0
        
        con_G2M = ''
        for i in range(1, num_G2M + 1):
            name_G2Mspecies = 'G2M_' + str(i)
            model.addSpecies(species_id=name_G2Mspecies+'_0', amt=c_G2M, comp='cell')
            model.addSpecies(species_id=name_G2Mspecies+'_1', amt=0.0, comp='cell')
            
            # Create reactions going from G2M_i_0 to G2M_i_1
            r = 'G2M_' + str(i) + '_0'
            p = 'G2M_' + str(i) + '_1'
            exp = 'r_53BP1_G2M' + ' * ' + r
            id_for_rxn = r + '_to_' + p
            model.addReaction(reactants=[r], products=[p], expression=exp, rxn_id=id_for_rxn)
            
            # Create assignment rules for G2M
            # If there is more than one sub-phase of G2M, then 
            # concatenate G2M_1 + G2M_2 + ... and assign to rule
            # Make sure you don't add last subphase to rule
            if num_G2M > 1 and i!=num_G2M:
                con_G2M = con_G2M + ' G2M_' + str(i) + '_0 +'
            
        # If there is more than one sub-phase of G2M, after for loop, we are 
        # just adding the last subphase to the rule        
        if num_G2M > 1:
            rule_G2M = con_G2M + 'G2M_' + str(num_G2M) + '_0'
        # If there is only one sub-phase of G2M, then rule is just G2M = G2M_1
        else:
            rule_G2M = 'G2M_1_0'
        
        model.addAssignmentRule(var='G2M', math=rule_G2M)

        # Create parameters for rates of G2M
        model.addParameter(param_id='r_53BP1_G2M', val=rate_G2M)
    
    
    # Create event to trigger going out of G1 phase if there are G1 subphases  
    if num_G1 > 0:
        # Construct the trigger which is when all the subphases of G1 have completed, 
        # so they are all 1
        trigger_G1_out = ''
        #for i in range(1,num_G1):
        # Construct assignment statements when trigger occurs, G1_i_1 set to 0
        assignments_G1_out = []
        for i in range(1,num_G1+1):
            assignments_G1_out.append(['G1_'+str(i)+'_1','0 item'])
            if (i!=num_G1):
                trigger_G1_out = trigger_G1_out + 'G1_' + str(i) + '_1 + '
        trigger_G1_out = trigger_G1_out + 'G1_' + str(num_G1) + '_1 == ' + str(num_G1)
        # If there are S subphases assignment S_i_0 set 1     
        if num_S > 0:
            for i in range(1,num_S+1):
                assignments_G1_out.append(['S_'+str(i)+'_0','1 item'])
        # If there are no S subphases and there are G2M subphases, 
        # assignment G2M_i_0 set 1
        elif num_G2M >0:
            for i in range(1,num_G2M+1):
                assignments_G1_out.append(['G2M_'+str(i)+'_0','1 item'])
        else:
            for i in range(1,num_G1+1):
                assignments_G1_out.append(['G1_'+str(i)+'_0','1 item'])
        dict_assignments = dict([(j[0],j[1]) for j in assignments_G1_out])
        model.addEvent(trigger= trigger_G1_out, assignments=dict_assignments,event_id = 'Leave_G1_trigger');

    # Create event to trigger going out of S phase if there are S subphases  
    if num_S > 0:
        # Construct the trigger which is when all the subphases of S have completed, 
        # so they are all 1
        trigger_S_out = ''
        #for i in range(1,num_S):
            
        # Construct assignment statements when trigger occurs, S_i_1 set to 0
        assignments_S_out = []
        for i in range(1,num_S+1):
            assignments_S_out.append(['S_'+str(i)+'_1','0 item'])
            if(i!=num_S):
                trigger_S_out = trigger_S_out + 'S_' + str(i) + '_1 + '
        trigger_S_out = trigger_S_out + 'S_' + str(num_S) + '_1 == ' + str(num_S)
        # If there are G2M subphases assignment G2M_i_0 set 1     
        if num_G2M > 0:
            for i in range(1,num_G2M+1):
                assignments_S_out.append(['G2M_'+str(i)+'_0','1 item'])
        # If there are no G2M subphases and there are G1 subphases, 
        # assignment G1_i_0 set 1
        elif num_G1 >0:
            for i in range(1,num_G1+1):
                assignments_S_out.append(['G1_'+str(i)+'_0','1 item'])
        # If there are no G2M subphases or G1 subphases, go back to S phase
        else:
            for i in range(1,num_S+1):
                assignments_S_out.append(['S_'+str(i)+'_0','1 item'])
        dict_assignments = dict([(j[0],j[1]) for j in assignments_S_out])
        model.addEvent(trigger= trigger_S_out, assignments=dict_assignments,event_id = 'Leave_S_trigger');
    
    # Create event to trigger going out of G2M phase if there are G2M subphases  
    if num_G2M > 0:
        # Construct the trigger which is when all the subphases of G2M have completed, 
        # so they are all 1
        trigger_G2M_out = ''
        #for i in range(1,num_G2M):
            
        # Construct assignment statements when trigger occurs, G2M_i_1 set to 0
        assignments_G2M_out = []
        for i in range(1,num_G2M+1):
            assignments_G2M_out.append(['G2M_'+str(i)+'_1','0 item'])
            if (i!=num_G2M):
                trigger_G2M_out = trigger_G2M_out + 'G2M_' + str(i) + '_1 + '
        trigger_G2M_out = trigger_G2M_out + 'G2M_' + str(num_G2M) + '_1 == ' + str(num_G2M)
        # If there are G1 subphases assignment G1_i_0 set 1     
        if num_G1 > 0:
            for i in range(1,num_G1+1):
                assignments_G2M_out.append(['G1_'+str(i)+'_0','1 item'])
        # If there are no G1 subphases and there are S subphases, 
        # assignment S_i_0 set 1
        elif num_S >0:
            for i in range(1,num_S+1):
                assignments_G2M_out.append(['S_'+str(i)+'_0','1 item'])
        # If there are no G1 subphases or S subphases, go back to G2M phase
        else:
            for i in range(1,num_G2M+1):
                assignments_G2M_out.append(['G2M_'+str(i)+'_0','1 item'])
        dict_assignments = dict([(j[0],j[1]) for j in assignments_G2M_out])
        model.addEvent(trigger= trigger_G2M_out, assignments=dict_assignments,event_id = 'Leave_G2M_trigger');    
    
    # Convert code to an sbml and write sbml to a file   
    sbml_to_write = model.toSBML()
    with open(writesbmlfile, 'w') as fw:
        fw.write(sbml_to_write)