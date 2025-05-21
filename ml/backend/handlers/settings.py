from fastapi import APIRouter

from config import config, full_version, update_config


router = APIRouter(prefix="/cfg")


@router.head("/changeversion")
async def change_project_version():
    global full_version
    full_version = not full_version
    config["full_version"] = full_version
    update_config()
