import os
import json
from config import configs_path

from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from iomodels import ModelNameModel
from active import active_models, chat_history, update_chathistory_file

from models.heavy_models import text_to_image_classes_mapping


router = APIRouter(prefix="/model")


def __get_model_config(model_name):
    model_filename = model_name + ".json"
    models_config_path = os.path.join(configs_path, model_filename)

    if not os.path.exists(models_config_path):
        raise HTTPException(status_code=404, detail=f"model '{model_name}' not found")

    with open(models_config_path, "r") as json_file:
        config_file = json.load(json_file)
        return config_file


@router.post("/launch")
async def launch_heavy_model(body: ModelNameModel):
    model_config = __get_model_config(model_name=body.model_name)

    match model_config["type"]:
        case "text2image":
            try:
                active_models[body.model_name] = text_to_image_classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"]
                )
            except ConnectionError as e:
                raise HTTPException(
                    status_code=408,
                    detail=f"Conntection Error: {e}"
                )

    if body.model_name not in chat_history:
        chat_history[body.model_name] = []
        update_chathistory_file()
    else:
        active_models[body.model_name].messages = chat_history[body.model_name]
