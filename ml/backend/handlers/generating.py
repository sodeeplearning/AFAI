from typing import List

from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.exceptions import HTTPException

from active import active_models, chat_history, update_chathistory_file
from iomodels import InputModel


router = APIRouter(prefix="/generate")


@router.post("/fromtext")
async def generate_text_only(body: InputModel) -> StreamingResponse:
    if body.model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {body.model_name} is not launched")

    chat_history[body.model_name] = active_models[body.model_name].messages
    update_chathistory_file()

    generator = active_models[body.model_name](
        prompt=body.prompt,
        max_new_tokens=body.max_new_tokens
    )
    return StreamingResponse(generator, media_type="text/event-stream")


@router.post("/fromimagetext")
async def generate_from_image_text(
        model_name: str,
        prompt: str,
        max_new_tokens: int = 2048,
        image_files: List[UploadFile] = None,
        image_links: List[str] = None
):
    if model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} is not launched")

    chat_history[model_name] = active_models[model_name].messages
    update_chathistory_file()

    image_bytes = []
    if image_files:
        for current_file in image_files:
            file_content = await current_file.read()
            image_bytes.append(file_content)

    generator = active_models[model_name](
        prompt=prompt,
        max_new_tokens=max_new_tokens,
        local_images=image_bytes,
        images_links=image_links
    )

    return StreamingResponse(generator, media_type="text/event-stream")
