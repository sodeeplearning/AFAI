from functools import wraps

from fastapi.exceptions import HTTPException

from active import active_models

from .model import get_model_config


def __raise_model_not_launched_error(model_name):
    raise HTTPException(status_code=404, detail=f"Model {model_name} is not launched")


def __raise_model_type_error(func, model_type, types):
    raise HTTPException(
        status_code=403,
        detail=f"""Type error: 
        You can't send {func.__name__} request to {model_type} model. 
        Available types: {types}"""
    )


def model_active_checker(func):
    @wraps(func)
    def wrapper(model_name, *args, **kwargs):
        if model_name not in active_models:
            __raise_model_not_launched_error(model_name=model_name)
        return func(model_name, args, kwargs)
    return wrapper


def available_model_types(types: list[str]):
    def decorator(func):
        @wraps(func)
        def wrapper(model_name, *args, **kwargs):
            model_config = get_model_config(model_name=model_name)
            model_type = model_config["type"]

            if model_type not in types:
                __raise_model_type_error(func, model_type, types)

            return func(model_name, *args, **kwargs)
        return wrapper
    return decorator


def available_model_types_async(types: list[str]):
    def decorator(func):
        @wraps(func)
        async def wrapper(model_name, *args, **kwargs):
            model_config = get_model_config(model_name=model_name)
            model_type = model_config["type"]

            if model_type not in types:
                __raise_model_type_error(func, model_type, types)

            return await func(model_name, *args, **kwargs)
        return wrapper
    return decorator
