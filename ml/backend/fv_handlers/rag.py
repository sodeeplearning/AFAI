import asyncio
import os
import shutil
from typing import List

import unstructured_pytesseract.pytesseract
from fastapi import APIRouter, UploadFile
from fastapi.exceptions import HTTPException

from utils.checker import available_model_types, model_active_checker

from active import active_models
from config import rag_files_path, temp_folder_path


router = APIRouter(prefix="/rag")


async def read_file(file) -> bytes:
    return await file.read()


@router.post("/addfilestorag")
@available_model_types(types=["text2text"])
@model_active_checker
def add_files_to_rag_model(model_name: str, files: List[UploadFile]):
    if not os.path.isdir(temp_folder_path):
        os.mkdir(temp_folder_path)

    if not os.path.isdir(rag_files_path):
        os.mkdir(rag_files_path)

    files_paths = []

    for file in files:
        file_content = asyncio.run(read_file(file))
        file_saving_path = os.path.join(temp_folder_path, file.filename)

        with open(file_saving_path, "wb") as writing_file:
            writing_file.write(file_content)
            files_paths.append(file_saving_path)

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

    model_database_path = os.path.join(rag_files_path, model_name)
    if not os.path.isdir(model_database_path):
        os.mkdir(model_database_path)

    active_models[model_name].save_database(path=model_database_path)


@router.delete("/clearragfiles")
@available_model_types(types=["text2text"])
def clear_rag_documents(model_name: str):
    if model_name in active_models:
        active_models[model_name].clear_documents()

    model_database_path = os.path.join(rag_files_path, model_name)

    if os.path.isdir(model_database_path):
        shutil.rmtree(model_database_path)
