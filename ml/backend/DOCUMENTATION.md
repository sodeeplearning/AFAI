# API Documentation


## Endpoints:
- [Launch model](#launch-model)
- [Kill model](#kill-model)
- [Delete model](#delete-model)
- [Get active models](#get-active-models)
- [Get available to download models](#get-available-to-download-models)
- [Is model heavy](#is-model-heavy)
- [Generate from text](#from-text)
- [Generate from image-text](#from-image-text)
- [Generate image from text](#generate-image-from-prompt)
- [Generate speech from text](#generate-speech-from-text)
- [Clear chat history](#clear-chat)
- [Add system prompt](#add-system-prompt)


# How to launch
```bash
cd ml
pip install -r requirements.txt

# If you need to have support of heavy models (e.g. text2image) install extra reqs:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
pip install -r extra.requirements.txt

fastapi dev ./backend/main.py
```
Then you can interact with API via 2 ways:
1. Go to this [**page**](http://127.0.0.1:8000/docs) and use UI.
2. Check ```test_app``` directory and use script for endpoint you need. 

**⚠️ Caution ⚠️** File ```ml/backend/config.py``` contains **full version** param.
- ```True``` if you need to use full version of the project including heavy models (e.g. text-to-image).
- ```False``` if you use the project on a weak computer or a phone. Only lite models will be available.

Choose variant whichever you want for your tasks.


# Requests  documentation

# Lite-part endpoints
Endpoints in the lite part of the project.

## Model Lifespan

Interacting with models

### Launch model
```POST /model/launch```

Download / Start model

```html request
Input:
    {
        "model_name": "string" - name of the model to launch
        "n_ctx": 8192 - size in tokens of model's context (memory)
    }

Output:
    null
```

### Kill model
```DELETE /model/kill```

Stop working model

```html request
Input:
    {
        "model_name": "string" - name of the model to kill
    }

Output:
    null
```

### Delete model
```DELETE /model/delete```

Delete installed model

```html request
Input:
    {
        "model_name": "string" - name of the model to delete
    }

Output:
    null
```

### Get active models
```GET /model/getactive```

Get all active (working at the moment) models

```html request
Output:
    [
        "model name 1",
        "model name 2",
        ...
        "model name N"
    ]
```

### Get available to download models
```GET /model/getravailabletodownload```

Get all models that you can download in your version

```html request
Output:
    [
        "model 1",
        "model 2",
        ...
        "model N"
    ]
```

### Is model heavy
```POST /model/ismodelheavy```
Check if model is heavy or not.
```html request
Input:
    {
        "model_name": Name of the model to check
    }

Output:
    {
        "is_heavy" True or False (depends on a model)
    }
```

## Generate
Get answer from model

### From Text
```POST /generate/fromtext```

Text-to-text generation

```html request
Input:
    {
        "model_name": "string" - Name of the model to get answer from
        "prompt": "string" - Prompt to the model
        "max_new_tokens": 512 - Max amount of generated tokens
    }

Output:
    StreamingResponse[text]
```

### From Image Text
```POST /generate/fromimagetext```

TextImage-to-Text generation (multi-modal)

```html request
Input:
    {
        "model_name": "string" - Name of the model to get answer from
        "prompt": "string" - Prompt to the model
        "max_new_tokens": 512 - Max amount of generated tokens
        "image_files": List[Uploadfile] - image files to the model
        "image_links": List[string] - links of images to the model
    }

Output:
    StreamingResponse[text]
```

### Generate image from prompt

```POST /generate/imagefromtext```

Generate image from single text prompt

```html_request
Input:
    {
      "model_name": string - Model to get answer from,
      "prompt": string - prompt / query to the model,
      "image_size": int = 1024 - Size of generated image (squared image)
    }
    
Output:
    Image
```

### Generate speech from text

```POST /generate/texttospeech```

Generate speech from text prompt.

```html_request
Input:
    {
        "model_name": string - Model to get answer from,
        "prompt" : string - Text prompt to get speech of
    }
   
Output:
    StreamingResponse (audiofile)
```

## Chat
Interact with models' chats

### Clear chat
```DELETE /chat/clearchat```

Clear chat history with the model

```html request
Input:
    {
        "model_name": string - Name of the model to clear chat with
    }

Output:
    null
```

### Add system prompt
```POST /chat/addsystemprompt```

Add system prompt to the model

```html request
Input:
    {
        "model_name": string - Name of the model to set its system prompt
        "system_prompt": string - System prompt to the model
    }

Output:
    null
```

# Heavy-part endpoints
Endpoints of heavy part of the project

## Heavy models lifespan

Lifespan of heavy models.

### Launch heavy model

```POST /heavy/model/launch```

Download or start model

```html_request
Input:
    {
      "model_name": string - Name of the model to launch
    }
Output:
    null
```

**Endpoints ```Delete``` and ```Kill``` are implemented in Lite-part of the project**
