from llama_cpp.llama_chat_format import (
    Llava15ChatHandler,
    MiniCPMv26ChatHandler,
    Llava16ChatHandler,
    NanoLlavaChatHandler,
    LlamaChatCompletionHandler
)

from .textmodel import TextOnlyModel
from .imagetextmodel import TextImageModel
from .texttospeech import BaseTextToSpeech


classes_mapping = {
    "text2text": TextOnlyModel,
    "imagetext2text": TextImageModel,
    "basetext2speech": BaseTextToSpeech
}

handler_mapping = {
    "llava15": Llava15ChatHandler,
    "llava16": Llava16ChatHandler,
    "minicpm": MiniCPMv26ChatHandler,
    "nanollava": NanoLlavaChatHandler,
    "llama": LlamaChatCompletionHandler
}