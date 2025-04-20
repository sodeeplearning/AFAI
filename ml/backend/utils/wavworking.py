import io
from pydub import AudioSegment


def convert_audio_to_vosk_wav(audio_bytes: bytes) -> bytes:
    """Convert bytes of audiofile to wav format that can be processed with vosk.

    :param audio_bytes: Bytes of audio file to convert.
    :return: Bytes of received file.
    """
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)  # 16-bit = 2 bytes

    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    return wav_io.getvalue()
