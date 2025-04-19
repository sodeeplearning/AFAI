from .texttoimage import TextToImageCascadeModel
from .texttospeech import TransformersTextToSpeechModel


classes_mapping = {
    "cascade_model": TextToImageCascadeModel,
    "transformers-tts": TransformersTextToSpeechModel
}
