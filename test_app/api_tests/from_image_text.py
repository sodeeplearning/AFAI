# Input data

image_paths = ["/home/vitalliy/Downloads/test_task_2.png"]
image_links = []
model_name = "minicpm-o-2.6-4"
max_new_tokens = 1024
prompt = "Solve this geometry task"


# Executing part
import base64
from test_app.config import host
import httpx
from pathlib import Path
import asyncio


def image_to_base64_data_uri(image_bytes: bytes):
    base64_data = base64.b64encode(image_bytes).decode('utf-8')
    return f"data:image/jpg;base64,{base64_data}"


async def process_request():
    async with httpx.AsyncClient(timeout=600) as client:
        async with client.stream("POST", url, json=data) as response:
            async for chunk in response.aiter_text():
                print(chunk, end="", flush=True)


for current_path in image_paths:
    with open(Path(current_path), "rb") as image_file:
        image_links.append(image_to_base64_data_uri(image_file.read()))

data = {
    "model_name": model_name,
    "prompt": prompt,
    "max_new_tokens": max_new_tokens,
    "image_links": image_links,
}

endpoint = "/generate/fromimagetext"
url = host + endpoint

asyncio.run(process_request())
