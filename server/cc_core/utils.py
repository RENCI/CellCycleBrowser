import json
import os

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


def get_phase_start_stop(data):
    """
    Get start and stop for a phase or subphase from the input time series data where start is
    indicated by a value of 1 and stop is indicated by a value of 0 in the time series data
    :param data: the time series data list
    :return: the indices in the data list for the start and stop
    """
    if data[0] == 1:
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
        if phase_start_idx == -1 and val == 1:
            phase_start_idx = idx

    return phase_start_idx, phase_stop_idx
