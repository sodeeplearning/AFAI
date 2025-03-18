import base64


def image_to_base64_data_uri(image_bytes: bytes):
    base64_data = base64.b64encode(image_bytes).decode('utf-8')
    return f"data:image/jpg;base64,{base64_data}"
