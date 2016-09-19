import json

def get_profile_list():
    profile_config_name = "data/config/profile_list.json"
    with open(profile_config_name, 'r') as profile_file:
        data = json.load(profile_file)
    return data
