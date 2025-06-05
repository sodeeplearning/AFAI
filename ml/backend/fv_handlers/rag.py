import asyncio
import os
import shutil
from typing import List

import unstructured_pytesseract.pytesseract
from fastapi import APIRouter, UploadFile
from fastapi.exceptions import HTTPException


from utils.iomodels import ModelNameModel
from utils.checker import is_model_active

from active import active_models
from config import rag_files_path, temp_folder_path


router = APIRouter(prefix="/rag")


async def read_file(file) -> bytes:
    return await file.read()


@router.post("/addfilestorag")
def add_files_to_rag_model(model_name: str, files: List[UploadFile]):
    if not os.path.isdir(temp_folder_path):
        os.mkdir(temp_folder_path)

    files_paths = []

    for file in files:
        file_content = asyncio.run(read_file(file))
        file_saving_path = os.path.join(temp_folder_path, file.filename)

        with open(file_saving_path, "wb") as writing_file:
            writing_file.write(file_content)
            files_paths.append(file_saving_path)

    is_model_active(model_name=model_name)

    try:
        active_models[model_name].add_documents(
            new_documents_paths=files_paths
        )
    except unstructured_pytesseract.pytesseract.TesseractNotFoundError:
        raise HTTPException(
            status_code=403,
            detail="Failed to process documents, cause at least one of them contains image."
        )

    shutil.rmtree(temp_folder_path)


@router.delete("/clearragfiles")
def clear_rag_documents(body: ModelNameModel):
    if body.model_name in active_models:
        active_models[body.model_name].clear_documents()
