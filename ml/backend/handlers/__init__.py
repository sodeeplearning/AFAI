from fastapi import APIRouter

from . import model_lifespan, generating, chat


router = APIRouter()

router.include_router(model_lifespan.router)
router.include_router(generating.router)
router.include_router(chat.router)
