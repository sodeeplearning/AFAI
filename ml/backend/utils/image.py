import base64


def image_to_base64_data_uri(image_bytes: bytes) -> str:
    """Convert bytes of image to uri for working in API format with models.

    :param image_bytes: Bytes of the image to convert.
    :return: Image's URI
    """
    base64_data = base64.b64encode(image_bytes).decode('utf-8')
    return f"data:image/jpg;base64,{base64_data}"
