from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from active import active_models, chat_history, update_chathistory_file
from utils.iomodels import ModelNameModel, SystemPromptModel


router = APIRouter(prefix="/chat")


not_found_exception = HTTPException(
    status_code=404,
    detail="Model isn't found."
)


@router.delete("/clearchat")
async def clear_chat_history(body: ModelNameModel):
    model_name = body.model_name

    if model_name not in chat_history:
        raise not_found_exception

    if model_name in active_models:
        active_models[model_name].messages = []
    chat_history[model_name] = []

    update_chathistory_file()


@router.post("/addsystemprompt")
async def add_system_prompt(body: SystemPromptModel):
    model_name = body.model_name

    if model_name not in chat_history or model_name not in active_models:
        raise not_found_exception

    adding_message = {
        "role": "system",
        "content": body.system_prompt
    }

    active_models[model_name].messages.append(adding_message)
    chat_history[body.model_name] = active_models[body.model_name].messages.copy()

    update_chathistory_file()


@router.get("/getchathistory")
async def get_chat_history():
    return chat_history


@router.post("/updatemodelchat")
async def update_model_chat_history(body: ModelNameModel):
    chat_history[body.model_name] = active_models[body.model_name].messages.copy()
    update_chathistory_file()
