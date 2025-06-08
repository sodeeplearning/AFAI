import os

from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from utils.iomodels import HeavyLaunchModel
from utils.model import get_model_config
from active import active_models, chat_history, update_chathistory_file
from config import rag_files_path

from models.heavy_models import classes_mapping, pipeline_mapping, rag_strategies_mapping


router = APIRouter(prefix="/model")


@router.post("/launch")
def launch_heavy_model(model_name: str, body: HeavyLaunchModel):
    model_config = get_model_config(model_name=model_name)

    try:
        match model_config["type"]:
            case "text2image":
                active_models[model_name] = classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"]
                )

            case "text2video":
                active_models[model_name] = classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"],
                    pipeline_class=pipeline_mapping[model_config["pipeline_name"]]
                )

            case "text2speech":
                active_models[model_name] = classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"]
                )

            case "text2text": # RAG in this case
                if body.rag_strategy not in rag_strategies_mapping:
                    raise HTTPException(
                        status_code=404,
                        detail=f"RAG strategy '{body.rag_strategy}' doesn't exist."
                    )

                rag_class = rag_strategies_mapping[body.rag_strategy]

                active_models[model_name] = classes_mapping[rag_class](
                    repo_id=model_config["repo_id"],
                    filename=model_config["filename"],
                    context_size=model_config["n_ctx"] if body.n_ctx == -1 else body.n_ctx
                )

                model_database_path = os.path.join(rag_files_path, model_name)
                if os.path.isdir(model_database_path):
                    active_models[model_name].load_database(path=model_database_path)


    except ConnectionError as e:
        raise HTTPException(
            status_code=408,
            detail=f"Conntection Error: {e}"
        )

    if model_name not in chat_history:
        chat_history[model_name] = []
        update_chathistory_file()
    else:
        active_models[model_name].messages = chat_history[model_name]
