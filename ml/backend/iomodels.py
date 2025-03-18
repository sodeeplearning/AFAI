from pydantic import BaseModel


class TextModel(BaseModel):
    text: str


class ModelNameMode(BaseModel):
    model_name: str


class LaunchModel(ModelNameMode):
    n_ctx: int = 8192
