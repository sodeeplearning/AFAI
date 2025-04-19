import re
from tqdm import tqdm


def split_text(text, max_len: int = 500) -> list[str]:
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
