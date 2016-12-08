from __future__ import absolute_import

import os
import logging
import json

import stochpy

from celery import shared_task
from django.conf import settings
from . import utils

logger = logging.getLogger('django')

@shared_task
def run_model_task(filename, id_to_names, species, phases, traj='', end='',
                   time_step_size=20, time_unit='second',
                   species_val_dict={}, sp_infl_para_dict={}):
    if traj:
        num_traj = int(traj)
    else:
        num_traj = 1

    if end:
        num_end = int(end)
    else:
        num_end = 100

    if time_step_size:
        ts_size = int(time_step_size)
    else:
        ts_size = 20

    plot_output_fname = os.path.splitext(filename)[0] + "_SpeciesTimeSeries_" + traj + ".json"
    plot_output_path_fname = os.path.join(settings.MODEL_OUTPUT_PATH, plot_output_fname)

    smod = stochpy.SSA(IsInteractive=False)
    smod.Model(filename, settings.MODEL_INPUT_PATH)
    for sp_id, sp_val in species_val_dict.iteritems():
        logger.debug('changing ' + sp_id + ' amount ' + sp_val)
        smod.ChangeInitialSpeciesCopyNumber(str(sp_id), float(sp_val))

    for id, val in sp_infl_para_dict.iteritems():
        logger.debug('changing ' + id + ' parameter value ' + val)
        smod.ChangeParameter(str(id), float(val))

    # TO DO: change this to a custom simulation method that automatically detects when the last
    # phase ends without requiring end time input
    smod.DoStochSim(mode="time", trajectories=num_traj, end=num_end, cellcycle=True)

    # TO DO: need to align model output with cell data taking into account time unit after custom
    # simulation method is done and used and after the SBML input model can simulation for long
    # time steps without raising exceptions
    # time_unit = time_unit.lower()
    # if time_unit == 'hour':
    #    num_end /= 3600
    # elif time_unit == 'minute':
    #   num_end /= 60
    # n_tps = num_end/ts_size + 1
    # smod.GetRegularGrid(n_samples=n_tps)
    # specs_data = smod.data_stochsim_grid.getSpecies(lbls=True)

    # return the original raw model output without putting the output on a regular grid
    specs_data = smod.data_stochsim.getSpecies(lbls=True)
    output_data = {}
    output_data['timeSteps'] = [row[0] for row in specs_data[0]]
    output_data['species'] = []
    output_data['phases'] = []
    phase_id_to_idx = {}
    for idx, val in enumerate(specs_data[1]):
        if val == 'Time':
            continue

        if val in species:
            sp = {}
            sp['name'] = id_to_names[val]
            sp['values'] = [row[idx] for row in specs_data[0]]
            output_data['species'].append(sp)
        else:
            # this id is a phase or subphase
            phase_id_to_idx[val] = idx

    # populate phase data
    sim_end_tp = 0
    for idx, val in enumerate(specs_data[1]):
        if val in phases:
            ph = {}
            ph['name'] = id_to_names[val]
            start, stop = utils.get_phase_start_stop([row[idx] for row in specs_data[0]])
            ph['start'] = start
            ph['stop'] = stop
            subphases_list = phases[val]
            sub_phases = []
            for s_id in subphases_list:
                s_idx = phase_id_to_idx[s_id]
                s_data = [row[s_idx] for row in specs_data[0]]
                s_start, s_stop = utils.get_phase_start_stop(s_data)
                # if s_start == -1 or s_stop == -1:
                    # this phase has not started or ended during simulation within specified end time
                    # sim_end_tp = -1
                # elif sim_end_tp != -1 and s_stop > sim_end_tp:
                    # record simulation end time point so far
                    # sim_end_tp = s_stop
                s_dict = {}
                s_dict['name'] = id_to_names[s_id]
                s_dict['start'] = s_start
                s_dict['stop'] = s_stop
                sub_phases.append(s_dict)
            ph['subPhases'] = sub_phases
            output_data['phases'].append(ph)

    # truncate simulation output data to when the last phase has ended as needed
    # if sim_end_tp > 0:
    #    del output_data['timeSteps'][sim_end_tp+1:]
    #    for spec_data in output_data['species']:
    #        del spec_data['values'][sim_end_tp+1:]

    with open(plot_output_path_fname, 'w') as json_file:
        json.dump(output_data, json_file,  indent=2)

    return plot_output_fname
