from fastapi import APIRouter

from . import model_lifespan
from . import rag


router = APIRouter(prefix="/heavy")

router.include_router(model_lifespan.router)
router.include_router(rag.router)
