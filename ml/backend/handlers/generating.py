import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, Response

from active import active_models

from utils.iomodels import (
    InputModel,
    TextImageInputModel,
    TextToImageInputModel,
    TextOnlyInputModel,
    SpeechInputModel,
    TextListModel,
    TextToVideoInputModel
)
from utils.checker import is_model_active


router = APIRouter(prefix="/generate")


async def read_file(file) -> bytes:
    return await file.read()



@router.post("/fromtext")
def generate_text_only(body: InputModel) -> StreamingResponse:
    is_model_active(model_name=body.model_name)

    return StreamingResponse(
        active_models[body.model_name](
            prompt=body.prompt,
            max_new_tokens=body.max_new_tokens
        ),
        media_type="text/event-stream"
    )


@router.post("/fromimagetext")
def generate_from_image_text(body: TextImageInputModel) -> StreamingResponse:
    model_name = body.model_name
    image_files = body.image_files

    is_model_active(model_name=body.model_name)

    image_bytes = []
    if image_files:
        for current_file in image_files:
            file_content = asyncio.run(read_file(file=current_file))
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
def generate_image_from_text_prompt(body: TextToImageInputModel) -> Response:
    is_model_active(model_name=body.model_name)

    generated_image_content = active_models[body.model_name](
        prompt=body.prompt,
        image_size=body.image_size,
        inference_steps=body.inference_steps
    )

    return Response(
        content=generated_image_content,
        media_type="image/jpg"
    )


@router.post("/videofromtext")
def generate_video_from_text_prompt(body: TextToVideoInputModel) -> Response:
    is_model_active(model_name=body.model_name)

    generated_video_content = active_models[body.model_name](
        prompt=body.prompt,
        frame_size=body.image_size,
        num_inference_steps=body.inference_steps,
        fps=body.fps,
        duration=body.duration
    )

    return Response(
        content=generated_video_content,
        media_type="video/mp4"
    )


@router.post("/texttospeech")
def generate_speech_from_text(body: TextOnlyInputModel) -> Response:
    is_model_active(model_name=body.model_name)

    return Response(
        active_models[body.model_name](prompt=body.prompt),
        media_type="audio/wav"
    )


@router.post("/speechtotext")
def speech_to_text(body: SpeechInputModel) -> TextListModel:
    is_model_active(model_name=body.model_name)

    audio_bytes = []
    for current_file in body.audio_files:
        audio_bytes.append(asyncio.run(read_file(current_file)))

    answers = []
    for current_bytes in audio_bytes + body.audio_links:
        generated = active_models[body.model_name](audio_file=current_bytes)
        answers.append(generated)

    return TextListModel(
        texts=answers
    )
