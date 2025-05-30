import os

from llama_cpp import Llama

from models.models_config import default_saving_path


class TextOnlyModel:
    """Class for Text2Text task."""

    def __init__(
            self,
            filename: str,
            repo_id: str = None,
            context_size: int = 8192,
            saving_path: str = default_saving_path
    ):
        """Constructor of TextOnlyModel.

        :param filename: Local file path / name of repo file.
        :param repo_id: Model's repo name.
        :param context_size: Max context size (memory of the model).
        :param saving_path: Path where model will be stored.
        """
        self.saving_path = os.path.join(saving_path, repo_id)

        if repo_id is None:
            self.model = Llama(
                filename,
                n_ctx=context_size,
                cache_dir=self.saving_path
            )
        else:
            self.model = Llama.from_pretrained(
                repo_id=repo_id,
                filename=filename,
                n_ctx=context_size,
                cache_dir=self.saving_path
            )

        self.messages = []

    def clear(self):
        """Clear model's chat history"""
        self.messages.clear()

    def __call__(self, prompt: str, max_new_tokens: int = 512):
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

        self.messages.append({"role": "assistant", "content": generated})

    def show(self, prompt: str):
        """Show example of model's working.

        :param prompt: Model's input.
        :return: None.
        """
        for new in self.__call__(prompt=prompt):
            print(new, end="", flush=True)
