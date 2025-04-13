from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from fastapi.responses import Response

from iomodels import TextToImageInputModel
from active import active_models


router = APIRouter(prefix="/generate")


@router.post("/imagefromtext")
async def generate_image_from_text_prompt(body: TextToImageInputModel):
    if body.model_name not in active_models:
        raise HTTPException(status_code=404, detail=f"Model {body.model_name} is not launched")

    generated_image_content = active_models[body.model_name](
        prompt=body.prompt,
        image_size=body.image_size
    )

    return Response(
        content=generated_image_content,
        media_type="image/jpg"
    )
