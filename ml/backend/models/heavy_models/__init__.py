from diffusers import LTXPipeline, LTXImageToVideoPipeline

from .texttoimage import TextToImageCascadeModel
from .texttospeech import TransformersTextToSpeechModel
from .texttovideo import TextImageToVideoModel
from .rag import BaseRAG, GraphRAG


classes_mapping = {
    "cascade_model": TextToImageCascadeModel,
    "transformers-tts": TransformersTextToSpeechModel,
    "textimagetovideo": TextImageToVideoModel,
    "BaseRAG": BaseRAG,
    "GraphRAG": GraphRAG
}

pipeline_mapping = {
    "LTX": LTXPipeline,
    "LTXimg2vid": LTXImageToVideoPipeline
}

rag_strategies_mapping = {
    "base": "BaseRAG",
    "graph": "GraphRAG"
}
