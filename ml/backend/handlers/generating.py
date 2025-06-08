import asyncio
from typing import List

from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse, Response

from active import active_models

from utils.iomodels import (
    InputModel,
    TextImageInputModel,
    TextToImageInputModel,
    TextListModel,
)
from utils.checker import is_model_active


router = APIRouter(prefix="/generate")


async def read_file(file) -> bytes:
    return await file.read()


@router.post("/fromtext")
def generate_text_only(model_name: str, body: InputModel) -> StreamingResponse:
    is_model_active(model_name=model_name)

    return StreamingResponse(
        active_models[model_name](
            prompt=body.prompt,
            max_new_tokens=body.max_new_tokens
        ),
        media_type="text/event-stream"
    )


@router.post("/fromimagetext")
def generate_from_image_text(model_name: str, body: TextImageInputModel) -> StreamingResponse:
    is_model_active(model_name=model_name)

    return StreamingResponse(
        active_models[model_name](
            prompt=body.prompt,
            max_new_tokens=body.max_new_tokens,
            images_links=body.image_links
        ),
        media_type="text/event-stream"
    )


@router.post("/imagefromtext")
def generate_image_from_text_prompt(model_name: str, body: TextToImageInputModel) -> Response:
    is_model_active(model_name=model_name)

    generated_image_content = active_models[model_name](
        prompt=body.prompt,
        image_size=body.image_size,
        inference_steps=body.inference_steps
    )

    return Response(
        content=generated_image_content,
        media_type="image/jpg"
    )


@router.post("/videofromtext")
def generate_video_from_text_image_prompt(
        model_name: str,
        prompt: str,
        image_size: int,
        inference_steps: int = 20,
        fps: int = 24,
        duration: int = 5,
        image: UploadFile = None
) -> Response:
    is_model_active(model_name=model_name)

    if image is not None:
        image = asyncio.run(read_file(image))

    generated_video_content = active_models[model_name](
        prompt=prompt,
        image=image,
        frame_size=image_size,
        num_inference_steps=inference_steps,
        fps=fps,
        duration=duration
    )

    return Response(
        content=generated_video_content,
        media_type="video/mp4"
    )


@router.post("/speechtotext")
def speech_to_text(
        model_name: str,
        audio_files: List[UploadFile]
) -> TextListModel:
    is_model_active(model_name=model_name)

    audio_bytes = []
    for current_file in audio_files:
        audio_bytes.append(asyncio.run(read_file(current_file)))

    answers = []
    for current_bytes in audio_bytes:
        generated = active_models[model_name](audio_file=current_bytes)
        answers.append(generated)

    return TextListModel(
        texts=answers
    )
