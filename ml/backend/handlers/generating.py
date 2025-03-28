from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from fastapi.exceptions import HTTPException

from active import active_models, chat_history, update_chathistory_file
from iomodels import InputModel, TextImageInputModel


router = APIRouter(prefix="/generate")


@router.post("/fromtext")
async def generate_text_only(body: InputModel) -> StreamingResponse:
    if body.model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {body.model_name} is not launched")

    chat_history[body.model_name] = active_models[body.model_name].messages
    update_chathistory_file()

    return StreamingResponse(
        active_models[body.model_name](
            prompt=body.prompt,
            max_new_tokens=body.max_new_tokens
        ),
        media_type="text/event-stream"
    )


@router.post("/fromimagetext")
async def generate_from_image_text(body: TextImageInputModel) -> StreamingResponse:
    model_name = body.model_name
    image_files = body.image_files

    if model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} is not launched")

    chat_history[model_name] = active_models[model_name].messages
    update_chathistory_file()

    image_bytes = []
    if image_files:
        for current_file in image_files:
            file_content = await current_file.read()
            image_bytes.append(file_content)

    return StreamingResponse(
        active_models[model_name](
            prompt=body.prompt,
            max_new_tokens=body.max_new_tokens,
            local_images=image_bytes,
            images_links=body.image_links
        ),
        media_type="text/event-stream"
    )
