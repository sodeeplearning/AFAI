import re
from tqdm import tqdm


def split_text(text, max_len: int = 500) -> list[str]:
    """Split text by sentences for text-to-speech task (memory overflow protection).

    :param text: Text to be split.
    :param max_len: Max length of one chunk (part of split text).
    :return: List of chunks (part of source text).
    """
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    chunks = []
    current_chunk = ""
    for sentence in tqdm(sentences, desc="Splitting text to smaller parts"):
        if len(current_chunk) + len(sentence) < max_len:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks
