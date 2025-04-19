import os
import json

from fastapi.exceptions import HTTPException

from config import configs_path


def get_model_config(model_name) -> dict:
    """Get models config json from configs list.

    :param model_name: Name of the model to get config.
    :return: Json (dict) of model's config.
    """
    model_filename = model_name + ".json"
    models_config_path = os.path.join(configs_path, model_filename)

    if not os.path.exists(models_config_path):
        raise HTTPException(status_code=404, detail=f"model '{model_name}' not found")

    with open(models_config_path, "r") as json_file:
        config_file = json.load(json_file)
        return config_file
