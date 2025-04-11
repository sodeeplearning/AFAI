import torch
from diffusers import StableCascadeDecoderPipeline, StableCascadePriorPipeline


class TextToImageCascadeModel:
    def __init__(self):
        self.prior = StableCascadePriorPipeline.from_pretrained(
            "stabilityai/stable-cascade-prior",
            variant="bf16",
            torch_dtype=torch.bfloat16,
            cache_dir="./saved"
        )
        self.decoder = StableCascadeDecoderPipeline.from_pretrained(
            "stabilityai/stable-cascade",
            variant="bf16",
            torch_dtype=torch.float16,
            cache_dir="./saved"
        )

    def __call__(self, prompt: str):
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
            image_embeddings=prior_output.image_embeddings.to(torch.float16),
            prompt=prompt,
            negative_prompt="",
            guidance_scale=0.0,
            output_type="pil",
            num_inference_steps=10
        ).images[0]

        return decoder_output
