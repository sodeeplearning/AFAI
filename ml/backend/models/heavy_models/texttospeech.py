from transformers import VitsModel, AutoTokenizer
import torch
import torchaudio
from pydub import AudioSegment
import io
from tqdm import tqdm

from models.models_config import default_saving_path
from utils.text import split_text


class TransformersTextToSpeechModel:
    """Class made for text-to-speech task with transformers implementation."""
    def __init__(
            self,
            repo_id: str = "facebook/mms-tts-eng",
            saving_path: str = default_saving_path
    ):
        """Constructor of TransformersTextToSpeechModel class.

        :param repo_id: ID of huggingface repo of the model.
        :param saving_path: Path to save model.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.model = VitsModel.from_pretrained(
            repo_id,
            device_map=self.device,
            cache_dir=saving_path
        )
        self.tokenizer = AutoTokenizer.from_pretrained(repo_id)

        self.model.eval()


    def __call__(self, prompt: str) -> bytes:
        """Get speech of prompt.

        :param prompt: Text to get speech of.
        :return: Bytes of generated audiofile.
        """
        final_audio = AudioSegment.empty()

        for chunk in tqdm(split_text(prompt), desc="Generating speech"):
            inputs = self.tokenizer(chunk, return_tensors="pt").to(self.device)
            with torch.no_grad():
                waveform = self.model(**inputs).waveform.cpu()

            buffer = io.BytesIO()
            torchaudio.save(buffer, waveform, sample_rate=self.model.config.sampling_rate, format="wav")
            buffer.seek(0)

            segment = AudioSegment.from_file(buffer, format="wav")
            final_audio += segment

        final_buffer = io.BytesIO()
        final_audio.export(final_buffer, format="wav")
        final_buffer.seek(0)

        return final_buffer.read()
