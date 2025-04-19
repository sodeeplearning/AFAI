import pyttsx3
import tempfile
import os


class BaseTextToSpeech:
    """Class made for TextToSpeech task using base utils."""
    def __init__(self, repo_id: str = None):
        """Constructor of BaseTextToSpeech class.

        :param repo_id: ID of HuggingFace repo. (useless for this class)
        """
        self.repo_id = repo_id
        self.engine = pyttsx3.init()

    def __call__(self, prompt: str) -> bytes:
        """Get speech of given prompt.

        :param prompt: Text to get speech of.
        :return: Bytes of audiofile with this speech
        """
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            temp_filename = tmp_file.name

        self.engine.save_to_file(prompt, temp_filename)
        self.engine.runAndWait()

        with open(temp_filename, 'rb') as f:
            audio_bytes = f.read()

        os.unlink(temp_filename)
        return audio_bytes
