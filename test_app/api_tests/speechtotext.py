model_name = "vosk-small-en"

paths_to_audio_files = [
    r"C:\Users\vital\Downloads\The_Connells_-_74-75_64492774.mp3"
]

# Executing part
import requests
from test_app.config import host

endpoint = "/generate/speechtotext"
url = host + endpoint

files = [
    ("audio_files", (f"file{i}.mp3", open(path, "rb"), "audio/wav"))
    for i, path in enumerate(paths_to_audio_files)
]

data = {
    "model_name": model_name
}

response = requests.post(url, data=data, files=files)
print(response.text)

