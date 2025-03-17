from llama_cpp import Llama
from llama_cpp.llama_chat_format import Llava15ChatHandler

from .utils.image import image_to_base64_data_uri


class LlavaModel:
    """Class for ImageText2Text task."""

    def __init__(
            self,
            filename: str,
            handler_filename: str = "*mmproj*",
            repo_id: str = None,
            context_size: int = 8192
    ):
        """Constructor of ImageTextModel class.

        :param filename: Local file path / name of repo file.
        :param handler_filename: Local handler file / name of repo file.
        :param repo_id: Model's repo name.
        :param context_size: Max context size (memory of the model).
        """
        if repo_id is None:
            self.handler = Llava15ChatHandler(handler_filename)
            self.model = Llama(
                filename,
                n_ctx=context_size,
                chat_handler=self.handler,
            )
        else:
            self.handler = Llava15ChatHandler.from_pretrained(
                repo_id=repo_id,
                filename=handler_filename
            )
            self.model = Llama.from_pretrained(
                repo_id=repo_id,
                filename=filename,
                n_ctx=context_size,
                chat_handler=self.handler,
            )
        self.messages = [
            {"role": "system", "content": "You are an assistant who perfectly describes images."}
        ]

    def __call__(
            self,
            prompt: str,
            local_images: list[bytes] = None,
            images_links: list[str] = None,
            max_new_tokens: int = 1024,
    ):
        """Get model's answer.

        :param prompt: Model's input.
        :param local_images: Images to model.
        :param images_links: Links to hosted images.
        :param max_new_tokens: Max amount of generated tokens.
        :return: Generator.
        """
        generated = ""

        new_message = {"role": "user", "content": [{"type": "text", "text": prompt}]}
        if local_images:
            for current_image in local_images:
                image_uri = image_to_base64_data_uri(current_image)
                new_message["content"].append({"type": "image_url", "image_url": {"url": image_uri}})

        if images_links:
            for current_link in images_links:
                new_message["content"].append({
                    "type": "image_url", "image_url": {"url": current_link}
                })

        self.messages.append(new_message)

        for new_generated in self.model.create_chat_completion(
                self.messages,
                max_tokens=max_new_tokens,
                stream=True
        ):
            new_token = new_generated["choices"][0]["delta"].get("content", "")
            generated += new_token
            yield new_token

        self.messages.append({"role": "assistant", "content": generated})

    def show(
            self,
            prompt: str,
            local_images: list[bytes] = None,
            images_links: list[str] = None,
            max_new_tokens: int = 1024,
    ):
        """Show example of model's working.

        :param prompt: Model's input.
        :param local_images: Images to model.
        :param images_links: Links to hosted images.
        :param max_new_tokens: Max amount of generated tokens.
        :return: None.
        """
        for new in self.__call__(
                prompt=prompt,
                local_images=local_images,
                images_links=images_links,
                max_new_tokens=max_new_tokens
        ):
            print(new, end="", flush=True)
