from fastapi import APIRouter

from . import model_lifespan


router = APIRouter(prefix="/heavy")

router.include_router(model_lifespan.router)
