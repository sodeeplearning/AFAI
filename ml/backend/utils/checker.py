from fastapi.exceptions import HTTPException

from active import active_models


def is_model_active(model_name: str) -> None:
    """Check if model is active. (408 error if it's not)

    :param model_name: Name of the model to check.
    :return: None.
    """
    if model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} is not launched")
