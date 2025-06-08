from pydantic import BaseModel
from typing import List


class TextModel(BaseModel):
    text: str


class SystemPromptModel(BaseModel):
    system_prompt: str


class LaunchModel(BaseModel):
    n_ctx: int = -1


class HeavyLaunchModel(LaunchModel):
    rag_strategy: str = "base"


class TextOnlyInputModel(BaseModel):
    prompt: str


class InputModel(TextOnlyInputModel):
    max_new_tokens: int = 1024


class TextToImageInputModel(TextOnlyInputModel):
    image_size: int = 1024
    inference_steps: int = 20


class TextImageInputModel(InputModel):
    image_links: List[str] = []


class HeavyCheckingModel(BaseModel):
    is_heavy: bool


class TextListModel(BaseModel):
    texts: List[str]
