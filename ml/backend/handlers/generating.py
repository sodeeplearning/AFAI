from fastapi import APIRouter
from fastapi.responses import StreamingResponse, Response

from active import active_models, chat_history, update_chathistory_file
from utils.iomodels import InputModel, TextImageInputModel, TextToImageInputModel, TextOnlyInputModel
from utils.checker import is_model_active


router = APIRouter(prefix="/generate")


@router.post("/fromtext")
async def generate_text_only(body: InputModel) -> StreamingResponse:
    is_model_active(model_name=body.model_name)

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

    is_model_active(model_name=body.model_name)

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


@router.post("/imagefromtext")
async def generate_image_from_text_prompt(body: TextToImageInputModel) -> Response:
    is_model_active(model_name=body.model_name)

    generated_image_content = active_models[body.model_name](
        prompt=body.prompt,
        image_size=body.image_size
    )

    return Response(
        content=generated_image_content,
        media_type="image/jpg"
    )


@router.post("/texttospeech")
async def generate_speech_from_text(body: TextOnlyInputModel) -> Response:
    is_model_active(model_name=body.model_name)

    return Response(
        active_models[body.model_name](prompt=body.prompt),
        media_type="audio/wav"
    )
