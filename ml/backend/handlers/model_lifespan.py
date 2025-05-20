import os
import shutil

from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from utils.iomodels import LaunchModel, ModelNameModel, HeavyCheckingModel
from utils.model import get_model_config
from config import full_version
from active import active_models, chat_history, update_chathistory_file

from models.lite_models import classes_mapping, handler_mapping
from models.models_config import default_saving_path


router = APIRouter(prefix="/model")


lite_models = [
    "deep-qwen-4",
    "llama-1b-4",
    "llava-1.5-7b-4",
    "minicpm-4",
    "pyttsx",
    "vosk-small-en",
    "vosk-ru",
    "llama-sum-4",
    "t-lite-4",
    "phi-4-mini-4",
    "kernel-4"
]
heavy_models = [
    "stable-cascade",
    "tts-eng",
    "tts-rus",
    "ltx-video",
    "ltx-img-vid"
]


@router.post("/launch")
def launch_model(body: LaunchModel):
    if body.model_name in heavy_models:
        raise HTTPException(
            status_code=403,
            detail="You are likely trying to launch 'heavy' model via endpoint for 'lite' models"
        )

    config_file = get_model_config(model_name=body.model_name)

    model_type = config_file["type"]
    repo_id = config_file["repo_id"]

    try:
        match model_type:
            case "text2text":
                n_ctx = body.n_ctx
                if n_ctx == -1:
                    n_ctx = config_file["n_ctx"]

                filename = config_file["filename"]
                active_models[body.model_name] = classes_mapping[model_type](
                    repo_id=repo_id,
                    filename=filename,
                    context_size=n_ctx
                )

            case "imagetext2text":
                n_ctx = body.n_ctx
                if n_ctx == -1:
                    n_ctx = config_file["n_ctx"]

                filename = config_file["filename"]
                handler_type = handler_mapping[config_file["handler_type"]]
                handler_filename = config_file["handler_filename"]

                active_models[body.model_name] = classes_mapping[model_type](
                    repo_id=repo_id,
                    filename=filename,
                    context_size=n_ctx,
                    handler_class=handler_type,
                    handler_filename=handler_filename
                )

            case "text2speech":
                class_name = config_file["class_name"]
                active_models[body.model_name] = classes_mapping[class_name](
                    repo_id=repo_id
                )

            case "speech2text":
                class_name = config_file["class_name"]
                active_models[body.model_name] = classes_mapping[class_name](
                    repo_id=repo_id
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


@router.delete("/kill")
async def kill_model(body: ModelNameModel):
    model_name = body.model_name
    if model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"model {model_name} is not launched or even exists.")

    del active_models[model_name]


@router.delete("/delete")
def delete_model(body: ModelNameModel):
    model_name = body.model_name
    config_file = get_model_config(model_name)
    repo_id = config_file["repo_id"]

    if model_name in active_models:
        del active_models[model_name]
    if model_name in chat_history:
        del chat_history[model_name]

    model_path = os.path.join(default_saving_path, repo_id)

    if not os.path.isdir(model_path):
        if body.model_name != "pyttsx":
            raise HTTPException(status_code=404, detail=f"model {model_name} is not installed.")
    else:
        shutil.rmtree(model_path)


@router.get("/getactive")
async def get_all_active_models() -> list[str]:
    return list(active_models.keys())


@router.get("/getavailabletodownload")
async def get_all_available_models_to_download_them():
    return lite_models + heavy_models * full_version


@router.post("/ismodelheavy")
async def check_if_model_is_heavy(body: ModelNameModel) -> HeavyCheckingModel:
    result = False
    if body.model_name in heavy_models:
        result = True
    return HeavyCheckingModel(
        is_heavy=result
    )
