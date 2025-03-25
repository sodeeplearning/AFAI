from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from active import active_models, chat_history, update_chathistory_file
from iomodels import ModelNameModel, SystemPromptModel


router = APIRouter(prefix="/chat")


def __check_model(model_name: str):
    if model_name not in active_models or model_name not in chat_history:
        raise HTTPException(
            status_code=404,
            detail="Model isn't found."
        )


@router.delete("/clearchat")
async def clear_chat_history(body: ModelNameModel):
    model_name = body.model_name

    __check_model(model_name=model_name)

    active_models[model_name].messages = []
    chat_history[model_name] = []

    update_chathistory_file()


@router.post("/addsystemprompt")
async def add_system_prompt(body: SystemPromptModel):
    model_name = body.model_name

    __check_model(model_name=model_name)

    adding_message = {
        "role": "system",
        "content": body.system_prompt
    }

    active_models[model_name].messages.append(adding_message)
    chat_history[model_name].append(adding_message)

    update_chathistory_file()
