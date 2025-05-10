from diffusers import LTXPipeline, LTXImageToVideoPipeline

from .texttoimage import TextToImageCascadeModel
from .texttospeech import TransformersTextToSpeechModel
from .texttovideo import TextImageToVideoModel


classes_mapping = {
    "cascade_model": TextToImageCascadeModel,
    "transformers-tts": TransformersTextToSpeechModel,
    "textimagetovideo": TextImageToVideoModel
}

pipeline_mapping = {
    "LTX": LTXPipeline,
    "LTXimg2vid": LTXImageToVideoPipeline
}
