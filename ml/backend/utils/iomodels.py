from pydantic import BaseModel
from typing import List
from fastapi import UploadFile


class TextModel(BaseModel):
    text: str


class ModelNameModel(BaseModel):
    model_name: str


class SystemPromptModel(ModelNameModel):
    system_prompt: str


class LaunchModel(ModelNameModel):
    n_ctx: int = -1


class TextOnlyInputModel(ModelNameModel):
    prompt: str


class InputModel(TextOnlyInputModel):
    max_new_tokens: int = 1024


class TextToImageInputModel(TextOnlyInputModel):
    image_size: int = 1024
    inference_steps: int = 20


class TextToVideoInputModel(TextToImageInputModel):
    fps: int = 24
    duration: int = 5
    image: UploadFile | None = None


class TextImageInputModel(InputModel):
    image_files: List[UploadFile] = []
    image_links: List[str] = []


class HeavyCheckingModel(BaseModel):
    is_heavy: bool


class SpeechInputModel(ModelNameModel):
    audio_files: List[UploadFile] = []
    audio_links: List[str] = []


class TextListModel(BaseModel):
    texts: List[str]
