import io
import os
import wave
import json
from vosk import Model, KaldiRecognizer

from models.models_config import default_saving_path

from utils.zipworking import download_and_extract_zip
from utils.wavworking import convert_audio_to_vosk_wav


class VoskSpeechToText:
    """Class made for Speech-to-text task (automatic speech recognition)."""
    def __init__(
            self,
            repo_id: str = "vosk-model-small-en-us-0.15",
            saving_path: str = default_saving_path
    ):
        """Constructor of VoskSpeechToText class.

        :param repo_id: Name of alphacephei model.
        :param saving_path: Path to save model.
        """
        self.saving_path = os.path.join(saving_path, repo_id)
        if not os.path.exists(self.saving_path):
            download_and_extract_zip(
                url=f"https://alphacephei.com/vosk/models/{repo_id}.zip",
                save_dir=saving_path
            )

        self.model = Model(
            model_path=self.saving_path
        )

    def __call__(self, audio_bytes: bytes) -> str:
        """Get text from audiofile.

        :param audio_bytes: Bytes of audiofile to get text from.
        :return: Received text.
        """
        wav_bytes = convert_audio_to_vosk_wav(audio_bytes)

        with wave.open(io.BytesIO(wav_bytes), 'rb') as wf:
            rec = KaldiRecognizer(self.model, wf.getframerate())

            result_text = ""
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break

                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    result_text += result.get("text", "") + " "

            final_result = json.loads(rec.FinalResult())
            result_text += final_result.get("text", "")

        return result_text.strip()


if __name__ == '__main__':
    model = VoskSpeechToText()
    with open(r"C:\Users\vital\Downloads\The_Connells_-_74-75_64492774.mp3", "rb") as audio_file:
        print(model(audio_bytes=audio_file.read()))
