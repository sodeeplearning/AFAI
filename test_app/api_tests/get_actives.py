# Input data

"""Get request with no data"""

# Executing part

from test_app.config import host
import requests

url = host + "/model/getactive"

response = requests.get(url)
print(response.text)
