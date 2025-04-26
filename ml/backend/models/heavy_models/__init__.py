from diffusers import LTXPipeline

from .texttoimage import TextToImageCascadeModel
from .texttospeech import TransformersTextToSpeechModel
from .texttovideo import TextToVideoModel


classes_mapping = {
    "cascade_model": TextToImageCascadeModel,
    "transformers-tts": TransformersTextToSpeechModel,
    "texttovideo": TextToVideoModel
}

pipeline_mapping = {
    "LTX": LTXPipeline
}
