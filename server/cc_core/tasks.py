from __future__ import absolute_import

import os

import stochpy

from celery import shared_task
from django.conf import settings


@shared_task
def run_model_task(filename, traj='', end=''):
    num_traj = 1
    if traj:
        num_traj = int(traj)
    num_end = 100
    if end:
        num_end = int(end)
    plot_output_fname = os.path.splitext(filename)[0] + "_SpeciesTimeSeriesPlot_" \
                        + traj + "_" + end + ".pdf"
    plot_output_path_fname = settings.MODEL_OUTPUT_PATH + plot_output_fname
    # only run simulation if existing simulation output does not exist
    if not os.path.exists(plot_output_path_fname):
        smod = stochpy.SSA(IsInteractive=False)
        smod.Model(filename, settings.MODEL_INPUT_PATH)
        smod.DoStochSim(mode="time", trajectories=num_traj, end=num_end)
        smod.PlotSpeciesTimeSeries()
        stochpy.plt.savefig(plot_output_fname)

    return plot_output_path_fname