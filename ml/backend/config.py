import json


def update_config():
    with open(config_path, "w") as updating_file:
        json.dump(config, updating_file)


config_path = "backend/config.json"

with open(config_path, "r") as json_file:
    config = json.load(json_file)

chathistory_path = config["chathistory_path"]
configs_path = config["configs_path"]
full_version = config["full_version"]
