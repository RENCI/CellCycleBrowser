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
                   species_val_dict={}, sp_infl_para_dict={}):
    if traj:
        num_traj = int(traj)
    else:
        num_traj = 1

    if end:
        num_end = int(end)
    else:
        num_end = 100

    plot_output_fname = os.path.splitext(filename)[0] + "_SpeciesTimeSeries_" \
                        + traj + "_" + end + ".json"
    plot_output_path_fname = os.path.join(settings.MODEL_OUTPUT_PATH, plot_output_fname)

    smod = stochpy.SSA(IsInteractive=False)
    smod.Model(filename, settings.MODEL_INPUT_PATH)
    for sp_id, sp_val in species_val_dict.iteritems():
        logger.debug('changing ' + sp_id + ' amount ' + sp_val)
        smod.ChangeInitialSpeciesCopyNumber(str(sp_id), float(sp_val))

    for id, val in sp_infl_para_dict.iteritems():
        logger.debug('changing ' + id + ' parameter value ' + val)
        smod.ChangeParameter(str(id), float(val))

    smod.DoStochSim(mode="time", trajectories=num_traj, end=num_end)
    n_tps = num_end/20+1
    smod.GetRegularGrid(n_samples=n_tps)
    specs_data = smod.data_stochsim_grid.getSpecies(lbls=True)
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
                s_dict = {}
                s_dict['name'] = id_to_names[s_id]
                s_dict['start'] = s_start
                s_dict['stop'] = s_stop
                sub_phases.append(s_dict)
            ph['subPhases'] = sub_phases
            output_data['phases'].append(ph)

    with open(plot_output_path_fname, 'w') as json_file:
        json.dump(output_data, json_file,  indent=2)

    return plot_output_fname
