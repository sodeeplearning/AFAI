# Adding new models guide.

You want to add some new models, but you don't know how?

**No problem!**

This guide will help to do this.

### You need to make these simple steps:

1. Create fork of this repo.
2. Decide which model it should be.

Now you need to write config file and some code. Let us explain how to do this

Required actions depend on model's ``type`` and dependencies.

### Text to text

Config file should look like this:
```json
{
  "type": "text2text",
  "repo_id": "unsloth/Llama-3.2-1B-Instruct-GGUF",
  "filename": "Llama-3.2-1B-Instruct-Q4_K_M.gguf",
  "n_ctx": 8192
}
```
Where 
- ```repo_id``` - ID of HuggingFace repo
- ```filename``` - name of the file with model's weights (recommended GGUF file)
- ```n_ctx``` - default size of model's context



### Text + Image to text

Config file should look like this:
```json
{
  "type": "imagetext2text",
  "repo_id": "mys/ggml_llava-v1.5-7b",
  "filename": "*q4_k*",
  "handler_filename": "*mmproj*",
  "handler_type": "llava15",
  "n_ctx": 8192
}
```

Where 
- ```repo_id``` - ID of HuggingFace repo
- ```filename``` - Name of the file with model's weights (recommended GGUF file)
- ```n_ctx``` - Default size of model's context
- ```handler_filename``` - Filename of llama.cpp handler. Default (*mmproj*) is useful for the most of the models.
- ```handler_type``` - Type of llama.cpp handler of the model. So far, available: "llava15", "llava16", "minicpm", "nanollava", "llama"



### Speech to text

Config file should look lite this:
```json
{
  "type": "speech2text",
  "class_name": "voskspeech2text",
  "repo_id": "vosk-model-ru-0.22"
}
```
Where
- ```class_name``` - Name of the class to use ("voskspeech2text" if you use just Vosk model).
- ```repo_id``` - Id of repo on Vosk or HuggingFace repo.



### Text to speech

Config file should look like this:

```json
{
  "type": "text2speech",
  "repo_id": "facebook/mms-tts-eng",
  "class_name": "transformers-tts"
}
```
Where
- ```repo_id``` - ID of HuggingFace repo.
- ```class_name``` - Name of the class to use ("transformers-tts" if you want to use model from HuggingFace and implemented via transformers library)



### Text to image

Config file should look like this:

```json
{
  "type": "text2image",
  "class_name": "cascade_model",
  "repo_id": "stabilityai/stable-cascade"
}
```
Where
- ```class_name``` - Name of the class to use (Now implemented only "cascade_model" for StableCascade-like models. If you want to use something different - write your own implementation)
- ```repo_id``` - ID of HuggingFace repo.



### Text to video

Config file should look like this:
```json
{
  "type": "text2video",
  "class_name": "texttovideo",
  "repo_id": "Lightricks/LTX-Video",
  "pipeline_name": "LTX"
}
```
Where 
- ```class_name``` - Name of the class to use ("texttovideo" - for default diffusers implementation)
- ```repo_id``` - ID of HuggingFace repo.
- ```pipeline_name``` - Name of the Pipeline class (Now implemented only "LTX". If you want to use something different, write your own implementation)

