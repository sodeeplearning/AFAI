import os
import requests
import zipfile
import io


def download_and_extract_zip(url: str, save_dir: str) -> None:
    """Download zip archive and extract it to save_dir.

    :param url: URL of archive.
    :param save_dir: Dir to save archive.
    :return: None.
    """
    os.makedirs(save_dir, exist_ok=True)

    response = requests.get(url)
    response.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
        zf.extractall(save_dir)
