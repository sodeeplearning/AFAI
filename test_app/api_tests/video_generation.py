# Input data

model_name = "ltx-video"

prompt = "Flying house"

image_size = 256
inference_steps = 10
fps = 24
duration = 5
image = None


# Execution part
from test_app.config import host
import requests

data = {
    "model_name": model_name,
    "prompt": prompt,
    "image_size": image_size,
    "inference_steps": inference_steps,
    "fps": fps,
    "duration": duration,
    "image": image
}

url = host + "/generate/videofromtext"

response = requests.post(url, json=data)
print(response.text)
