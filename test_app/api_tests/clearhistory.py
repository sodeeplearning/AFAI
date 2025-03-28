# Input data

model_name = "minicpm-o-2.6-4"


# Executing part

from test_app.config import host
import requests

data = {
    "model_name": model_name
}
url = host + "/chat/clearchat"

response = requests.delete(url, json=data)
print(response)
