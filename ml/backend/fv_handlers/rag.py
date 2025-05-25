import asyncio
import os
import shutil

from fastapi import APIRouter

from utils.iomodels import AddingFilesModel, ModelNameModel
from utils.checker import is_model_active

from active import active_models
from config import rag_files_path


router = APIRouter(prefix="/rag")


async def read_file(file) -> bytes:
    return await file.read()


@router.post("/addfilestorag")
def add_files_to_rag_model(body: AddingFilesModel):
    models_files_path = os.path.join(rag_files_path, body.model_name)
    if not os.path.isdir(models_files_path):
        os.mkdir(models_files_path)

    files_paths = []

    for file in body.files:
        file_content = asyncio.run(read_file(file))
        file_saving_path = os.path.join(models_files_path, file.filename)

        with open(file_saving_path, "w") as writing_file:
            writing_file.write(file_content)
            files_paths.append(file_saving_path)

    is_model_active(model_name=body.model_name)

    active_models[body.model_name].add_documents(
        new_documents_paths=files_paths
    )


@router.delete("/clearragfiles")
def clear_rag_documents(body: ModelNameModel):
    if body.model_name in active_models:
        active_models[body.model_name].clear_documents()

    models_files_path = os.path.join(rag_files_path, body.model_name)

    if os.path.isdir(models_files_path):
        shutil.rmtree(models_files_path)
