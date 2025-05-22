import subprocess
import re

from fastapi import APIRouter

from config import config, full_version, update_config


router = APIRouter(prefix="/cfg")


@router.head("/changeversion")
async def change_project_version():
    global full_version
    full_version = not full_version
    config["full_version"] = full_version
    update_config()


@router.head("/instsalldeps")
def install_heavy_dependencies():
    subprocess.check_call(["pip", "install", "-r", "extra.requirements.txt"])


@router.head("/deletedeps")
def delete_heavy_dependencies():
    with open("extra.requirements.txt", "r") as dep_file:
        lines = dep_file.readlines()

    packages = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#'):
            package_name = re.split(r'[<>=~]', line)[0].strip()
            if package_name:
                packages.append(package_name)

    if packages:
        subprocess.check_call(["pip", "uninstall", "-y"] + packages)
