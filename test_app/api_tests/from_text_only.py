# Input data

model_name = "minicpm-o-2.6-4"
max_new_tokens = 1024
prompt = "What is cosine of 210 degrees?"


# Executing part

import httpx
from test_app.config import host
import asyncio


async def process_request():
    async with httpx.AsyncClient(timeout=60) as client:
        async with client.stream("POST", url, json=data) as response:
            async for chunk in response.aiter_text():
                print(chunk, end="", flush=True)


data = {
    "model_name": model_name,
    "prompt": prompt,
    "max_new_tokens": max_new_tokens
}

endpoint = "/generate/fromtext"
url = host + endpoint

asyncio.run(process_request())
