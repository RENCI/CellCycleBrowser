from __future__ import absolute_import

import os
import sys
import logging
import json
import shutil
import time
import datetime

import stochpy

from celery import shared_task
from celery.task import periodic_task
from celery.schedules import crontab
from django.conf import settings
from . import utils

logger = logging.getLogger('django')


@periodic_task(ignore_result=True, run_every=crontab(minute=0, hour=0))
def delete_guest_workspaces():
    # only delete guest workspaces when the workspaces have existed for over 12 hours
    to_delete = False

    for dirName, subdirList, fileList in os.walk(settings.GUEST_WORKSPACE_PATH):
        for sdn in subdirList:
            spath = os.path.join(dirName, sdn)
            if not to_delete:
                ctime = os.path.getctime(spath)
                ctime_dt = datetime.datetime.strptime(time.ctime(ctime), "%a %b %d %H:%M:%S %Y")
                ctime_now = datetime.datetime.now()
                time_delta = ctime_now - ctime_dt
                time_delta_hrs = int(str(time_delta).split(':')[0])
                if time_delta_hrs > 12:
                    to_delete = True
            if to_delete:
                shutil.rmtree(spath)
        for fname in fileList:
            if to_delete:
                os.remove(os.path.join(dirName, fname))


@shared_task(bind=True)
def run_model_task(self, ws_path, filename, id_to_names, species, phases, traj='', species_val_dict={},
                   sp_infl_para_dict={}):
    if traj:
        num_traj = int(traj)
    else:
        num_traj = 1

    plot_output_fname = os.path.splitext(filename)[0] + "_SpeciesTimeSeries_" + traj + ".json"
    plot_output_path_fname = os.path.join(ws_path, settings.MODEL_OUTPUT_PATH, plot_output_fname)
    smod = stochpy.SSA(IsInteractive=False)
    m_path = os.path.join(ws_path, settings.MODEL_INPUT_PATH)
    smod.Model(filename, m_path)
    for sp_id, sp_val in species_val_dict.iteritems():
        logger.debug('changing ' + str(sp_id) + ' amount ' + str(sp_val))
        smod.ChangeInitialSpeciesCopyNumber(str(sp_id), float(sp_val))

    for id, val in sp_infl_para_dict.iteritems():
        logger.debug('changing ' + str(id) + ' parameter value ' + str(val))
        smod.ChangeParameter(str(id), float(val))

    try:
        # call a custom simulation method by setting cellcycle to True which automatically detects
        # when the last phase ends without requiring end time input. Setting end to int type max
        # but simulation will break out of the loop after the cell cycle ends
        smod.DoStochSim(mode="time", trajectories=num_traj, end=sys.maxint, cellcycle=True, task_id=self.request.id)
    except Exception as ex:
        # delete progress file if exist
        pfilename = os.path.join(ws_path, settings.MODEL_OUTPUT_PATH, 'progress' + self.request.id + '.txt')
        try:
            os.remove(pfilename)
        except OSError:
            pass
        raise Exception(ex.message)

    max_traj = smod.data_stochsim.simulation_trajectory
    if max_traj != num_traj:
        logger.debug("StochPy default simulation trajectory is not the latest trajectory, "
                     "StochPy default trajectory is {}, latest trajectory is {}".format(max_traj,
                                                                                        num_traj))

    whole_output_data = []
    for traj in range(max_traj, 0, -1):
        # by default, the latest trajectory is returned without explicting setting trajectory data
        if traj != max_traj:
            smod.GetTrajectoryData(traj)
        # return the original raw model output for each trajectory
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
        # sim_end_tp = 0
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

        whole_output_data.append(output_data)
    output_data_dict = {'result': whole_output_data}
    # truncate simulation output data to when the last phase has ended as needed
    # if sim_end_tp > 0:
    #    del output_data['timeSteps'][sim_end_tp+1:]
    #    for spec_data in output_data['species']:
    #        del spec_data['values'][sim_end_tp+1:]

    with open(plot_output_path_fname, 'w') as json_file:
        json.dump(output_data_dict, json_file,  indent=2)

    # delete progress file if exist
    pfilename = os.path.join(settings.WORKSPACE_PATH, settings.MODEL_OUTPUT_PATH, 'progress' + self.request.id + '.txt')
    try:
        os.remove(pfilename)
    except OSError:
        pass

    return plot_output_fname
