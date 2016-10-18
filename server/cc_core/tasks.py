from __future__ import absolute_import

import os
import logging
import stochpy

from celery import shared_task
from django.conf import settings

logger = logging.getLogger('django')

@shared_task
def run_model_task(filename, traj='', end=''):
    num_traj = 1
    if traj:
        num_traj = int(traj)
    num_end = 100
    if end:
        num_end = int(end)

    plot_output_fname = os.path.splitext(filename)[0] + "_SpeciesTimeSeries_" \
                        + traj + "_" + end + ".json"
    plot_output_path_fname = os.path.join(settings.MODEL_OUTPUT_PATH, plot_output_fname)
    logger.debug("in run_model_task, traj=" + traj + ", end=" + end + ", output_path_fname:" +
                 plot_output_path_fname)
    # only run simulation if existing simulation output does not exist
    if not os.path.exists(plot_output_path_fname):
        logger.debug("before starting simulation")
        smod = stochpy.SSA(IsInteractive=False)
        smod.Model(filename, settings.MODEL_INPUT_PATH)
        smod.DoStochSim(mode="time", trajectories=num_traj, end=num_end)
        smod.GetRegularGrid(n_samples=num_end/20)
        specs_data = smod.data_stochsim_grid.getSpecies(lbls=True)
        logger.debug('After simulation, output data follows:')
        logger.debug("specs_data[0]: ")
        logger.debug(specs_data[0])
        logger.debug("specs_data[1]: ")
        logger.debug(specs_data[1])

    return plot_output_fname
