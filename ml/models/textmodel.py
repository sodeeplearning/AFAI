from llama_cpp import Llama
from collections import deque


class TextOnlyModel:
    def __init__(
            self,
            filename: str,
            repo_id: str = None,
            context_size: int = 8192
    ):
        """Model for Text2Text task.

        :param filename: Local file path / name of repo file.
        :param repo_id: Model's repo name.
        :param context_size: Max context size (memory of the model).
        """
        if repo_id is None:
            self.model = Llama(filename, n_ctx=context_size)
        else:
            self.model = Llama.from_pretrained(
                repo_id=repo_id,
                filename=filename,
                n_ctx=context_size
            )

        self.messages = deque()

    def __call__(self, prompt: str, max_new_tokens: int = 1024):
        """Get generator of model's response.

        :param prompt: Input to the model.
        :param max_new_tokens: Max amount of generated tokens.
        :return: Generator with strings.
        """
        generated = ""
        self.messages.append({"role": "user", "content": prompt})
        for new_generated in self.model.create_chat_completion(
                self.messages,
                max_tokens=max_new_tokens,
                stream=True
        ):
            new_token = new_generated["choices"][0]["delta"].get("content", "")
            generated += new_token
            yield new_token


if __name__ == '__main__':
    model = TextOnlyModel(
        repo_id="unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF",
        filename="*q4-k-m"
    )
    for new in model("What is cosine of 225 degrees?"):
        print(new)