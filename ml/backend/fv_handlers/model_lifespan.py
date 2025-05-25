from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from utils.iomodels import ModelNameModel
from utils.model import get_model_config
from active import active_models, chat_history, update_chathistory_file

from models.heavy_models import classes_mapping, pipeline_mapping


router = APIRouter(prefix="/model")


@router.post("/launch")
def launch_heavy_model(body: ModelNameModel):
    model_config = get_model_config(model_name=body.model_name)

    try:
        match model_config["type"]:
            case "text2image":
                active_models[body.model_name] = classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"]
                )

            case "text2video":
                active_models[body.model_name] = classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"],
                    pipeline_class=pipeline_mapping[model_config["pipeline_name"]]
                )

            case "text2speech":
                active_models[body.model_name] = classes_mapping[model_config["class_name"]](
                    repo_id=model_config["repo_id"]
                )

            case "text2text": # RAG in this case
                active_models[body.model_name] = classes_mapping["BaseRAG"](
                    repo_id=model_config["repo_id"],
                    filename=model_config["filename"],
                    context_size=model_config["n_ctx"]
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
