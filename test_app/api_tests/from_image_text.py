from test_app.config import host
import requests
import base64

# Input data
image_paths = [r"C:\Users\vital\Downloads\test.jpg"]
image_links = []
model_name = "minicpm-o-2.6-4"
max_new_tokens = 1024
prompt = "Describe this image"

# Подготовка файлов
files = []
for current_path in image_paths:
    with open(current_path, "rb") as image_file:
        files.append(("image_files", (current_path, base64.b64encode(image_file.read()).decode("utf-8"), "image/jpeg")))

# Подготовка данных
data = {
    "model_name": model_name,
    "prompt": prompt,
    "max_new_tokens": max_new_tokens,
    "image_links": image_links,
}

# Отправка запроса
url = host + "/generate/fromimagetext"
response = requests.post(url, json=data)
print(response.text)  # Вывод ответа сервера