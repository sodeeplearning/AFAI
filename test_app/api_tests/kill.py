# Input data

model_name = "minicpm-o-2.6-4"

# Executing part

from test_app.config import host
import requests


url = host + "/model/kill"

data = {
    "model_name": model_name
}

response = requests.delete(url, json=data)
print(response)
