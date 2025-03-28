# Input data

model_name = "minicpm-o-2.6-4"


# Executing part
from test_app.config import host
import requests

endpoint_name = "/model/launch"
url = host + endpoint_name

body = {
    "model_name": model_name,
    "n_ctx": -1
}

response = requests.post(url, json=body)
print(response)
