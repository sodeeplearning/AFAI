import os
import json

from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from iomodels import LaunchModel, ModelNameMode
from config import configs_path
from active import active_models, chat_history, update_chathistory_file

from models.mapping import classes_mapping, handler_mapping


router = APIRouter(prefix="/model")


@router.post("/launch")
async def launch_model(body: LaunchModel):
    model_name = body.model_name + ".json"
    models_config_path = os.path.join(configs_path, model_name)

    if not os.path.exists(models_config_path):
        raise HTTPException(status_code=404, detail=f"model '{model_name}' not found")

    with open(models_config_path, "r") as json_file:
        config_file = json.load(json_file)

    model_type = config_file["type"]
    repo_id = config_file["repo_id"]
    filename = config_file["filename"]
    n_ctx = config_file["n_ctx"]

    match model_type:
        case "text2text":
            active_models[body.model_name] = classes_mapping[model_type](
                repo_id=repo_id,
                filename=filename,
                context_size=n_ctx
            )

        case "imagetext2text":
            handler_type = handler_mapping[config_file["handler_type"]]
            handler_filename = config_file["handler_filename"]

            active_models[body.model_name] = classes_mapping[model_type](
                repo_id=repo_id,
                filename=filename,
                content_size=n_ctx,
                handler_type=handler_type,
                handler_filename=handler_filename
            )

    if model_name not in chat_history:
        chat_history[model_name] = []
        update_chathistory_file()


@router.delete("/kill")
async def kill_model(body: ModelNameMode):
    model_name = body.model_name
    if model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"model {model_name} is not launched or even exists")

    del active_models[model_name]


@router.get("/getactive")
async def get_all_active_models() -> list[str]:
    return list(active_models.keys())
