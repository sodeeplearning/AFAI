from pydantic import BaseModel


class TextModel(BaseModel):
    text: str


class ModelNameModel(BaseModel):
    model_name: str


class LaunchModel(ModelNameModel):
    n_ctx: int = 8192


class InputModel(ModelNameModel):
    prompt: str
    max_new_tokens: int = 2048
