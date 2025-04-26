import os

import torch
from diffusers.utils.export_utils import export_to_video
from diffusers import LTXPipeline

from models.models_config import default_saving_path


class TextToVideoModel:
    """Class made for TextToVideo task."""
    def __init__(
            self,
            repo_id: str = "Lightricks/LTX-Video",
            saving_path: str = default_saving_path,
            pipeline_class = LTXPipeline
    ):
        """Constructor of TextToVideoModel class.

        :param repo_id: ID of huggingface repo of the model.
        :param saving_path: Path to save model.
        :param pipeline_class: Class of diffusers pipeline model.
        """
        self.saving_path = os.path.join(saving_path, repo_id)

        self.pipe = pipeline_class.from_pretrained(
            repo_id,
            torch_dtype=torch.bfloat16,
            cache_dir=self.saving_path
        )
        if torch.cuda.is_available():
            self.pipe.to("cuda")

    def __call__(
            self,
            prompt: str,
            frame_size: int = 224,
            num_inference_steps: int = 50,
            fps: int = 24,
            duration: int = 5
    ) -> bytes:
        """Generate video from text prompt.

        :param prompt: Description of video to generate.
        :param frame_size: Resolution of each frame in the generated video.
        :param num_inference_steps: Num of steps to generate (more steps - more quality and more time for generation).
        :param fps: Num of frames in generated video.
        :param duration: Duration of generated video (in seconds).
        :return:
        """
        temp_file_path: str = "temp.mp4"

        video_frames = self.pipe(
            prompt=prompt,
            width=frame_size,
            height=frame_size,
            num_frames=fps * duration + 1,
            num_inference_steps=num_inference_steps,
        ).frames[0]

        export_to_video(video_frames, fps=fps, output_video_path=temp_file_path)

        with open(temp_file_path, "rb") as video_file:
            video_bytes = video_file.read()

        os.remove(temp_file_path)

        return video_bytes
