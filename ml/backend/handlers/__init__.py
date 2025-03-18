from fastapi import APIRouter

from . import model_lifespan


router = APIRouter()

router.include_router(model_lifespan.router)
