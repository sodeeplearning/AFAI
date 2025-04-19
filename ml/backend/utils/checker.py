from fastapi.exceptions import HTTPException

from active import active_models


def is_model_active(model_name: str) -> None:
    if model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} is not launched")
