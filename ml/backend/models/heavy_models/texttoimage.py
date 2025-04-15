import os

import torch
from diffusers import StableCascadeDecoderPipeline, StableCascadePriorPipeline

from models.models_config import default_saving_path


class TextToImageCascadeModel:
    """Class of StableCascade (text to image) model."""
    def __init__(
            self,
            repo_id: str = "stabilityai/stable-cascade",
            saving_path: str = default_saving_path
    ):
        """Constructor of StableCascade class.

        :param repo_id: ID of HuggingFace repo.
        :param saving_path: Path to a dir to cache model.
        """
        self.saving_path = os.path.join(saving_path, repo_id)
        self.prior = StableCascadePriorPipeline.from_pretrained(
            repo_id + "-prior",
            variant="bf16",
            cache_dir=self.saving_path,
            torch_dtype=torch.bfloat16
        )
        self.decoder = StableCascadeDecoderPipeline.from_pretrained(
            repo_id,
            variant="bf16",
            cache_dir=self.saving_path,
            torch_dtype=torch.bfloat16
        )

    def __call__(
            self,
            prompt: str,
            image_size: int = 1024,
    ) -> bytes:
        """Generate image from prompt.

        :param prompt: Prompt to a model (description of image to generate).
        :param image_size: Size of generated image (squared image).

        :return: bytes of generated image.
        """
        self.prior.enable_model_cpu_offload()
        prior_output = self.prior(
            prompt=prompt,
            height=1024,
            width=1024,
            negative_prompt="",
            guidance_scale=4.0,
            num_images_per_prompt=1,
            num_inference_steps=20
        )

        self.decoder.enable_model_cpu_offload()
        decoder_output = self.decoder(
            image_embeddings=prior_output.image_embeddings,
            prompt=prompt,
            negative_prompt="",
            guidance_scale=0.0,
            output_type="pil",
            num_inference_steps=10
        ).images[0]

        return decoder_output.tobytes()
