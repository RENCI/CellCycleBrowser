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
