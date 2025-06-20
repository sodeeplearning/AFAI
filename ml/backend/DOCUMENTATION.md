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
- [Generate video from text or image](#generate-video-from-prompt)
- [Generate speech from text](#generate-speech-from-text)
- [Clear chat history](#clear-chat)
- [Get chat history](#get-chat-history)
- [Update model chat](#update-model-chat)
- [Add system prompt](#add-system-prompt)
- [Install heavy dependencies](#install-heavy-dependencies)
- [Delete heavy dependencies](#delete-heavy-dependencies)
- [Launch heavy model](#launch-heavy-model)
- [Add files to RAG](#add-files-to-rag)
- [Clear RAG documents](#clear-rag-files)


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
        "n_ctx": -1 - size in tokens of model's context (memory)
    }
```

### Kill model
```DELETE /model/kill```

Stop working model

```html request
Input:
    model_name: string - name of the model to kill
```

### Delete model
```DELETE /model/delete```

Delete installed model

```html request
Input:
    model_name: string - name of the model to delete
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
    model_name: string - Name of the model to check
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
    model_name: string - Name of the model to get answer from
    {
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
    model_name: string - Name of the model to get answer from
    {
        prompt: "string" - Prompt to the model
        max_new_tokens: 512 - Max amount of generated tokens
        image_links: List[string] - links of images to the model
    }

Output:
    StreamingResponse[text]
```

### Generate image from prompt

```POST /generate/imagefromtext```

Generate image from single text prompt

```html request
Input:
    model_name: string - Model to get answer from
    {
      "prompt": string - prompt / query to the model,
      "image_size": int = 1024 - Size of generated image (squared image),
      "inference_steps": 20 - More steps - more quality and longer generation
    }
    
Output:
    Image
```

### Generate video from prompt

```POST /generate/videofromprompt```

Generate video from text prompt

```html request
Input:
      model_name: string - Model to get answer from,
      prompt: string - description of generated video,
      image: UploadFile - image (for image to video task), can be None
      image_size: 1024 - Resolution of video frames,
      inference_steps: 20 - More steps - more quality and longer generation,
      fps: 24 - Amount of frames in generated video,
      duration: 5 - Duration of generated video in seconds

Output:
    Video
```

### Generate speech from text

```POST /generate/texttospeech```

Generate speech from text prompt.

```html request
Input:
    model_name: string - Model to get answer from
    {
        "prompt" : string - Text prompt to get speech of
    }
   
Output:
    StreamingResponse (audiofile)
```

### Generate text from speech

```POST /generate/speechtotext```

Extract text of speech in audiofile.

```html request
Input:
    model_name: string - Name of the model using to extract text,
    audio_files: List[Uploadfile] - List of audio files to get text of speech from (can be empty)

Output:
    {
        "texts": [
            "Text1",
            "Text2",
            ...
        ]
    }
```

## Chat
Interact with models' chats

### Clear chat
```DELETE /chat/clearchat```

Clear chat history with the model

```html request
Input:
    model_name: string - Name of the model to clear chat with
```

### Add system prompt
```POST /chat/addsystemprompt```

Add system prompt to the model

```html request
Input:
    model_name: string - Name of the model to set its system prompt
    {
        "system_prompt": string - System prompt to the model
    }
```

### Get chat history
```GET /chat/getchathistory```

Get chat history (json format model_name - message1, message2...)

```html request
Output:
    {
        "model 1": [message1, message2, ...],
        ...
    }
```

### Update model chat
```POST /chat/updatemodelchat```

Update chat with model (it doesn't happen automatically yet)

```html request
Input:
    model_name - Name of the model to update chat with.
```

## Settings

Interact with the app details

### Change project version

```HEAD /cfg/changeversion```

Change project version from lite to heavy or vice versa.

```html request
Input:
    null
Output:
    null
```

### Install heavy dependencies

```HEAD /cfg/installdeps```

Install pip dependencies needed for heavy part of the project

```html request
Input:
    null
Output:
    null
```


### Delete heavy dependencies

```HEAD /cfg/deletedeps```

Delete pip dependencies needed for heavy part of the project

```html request
Input:
    null
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

```html request
Input:
    model_name: string - name of the model to launch
    {
        "n_ctx": int = -1 - size in tokens of model's context (memory)
        "rag_strategy": string = "base" - Type of RAG class (now available: "base", "graph")
    }

Output:
    null
```

**Endpoints ```Delete``` and ```Kill``` are implemented in Lite-part of the project**

### Add files to rag

```POST /heavy/rag/addfilestorag```

Add documents to RAG model directory

```html request
Input:
    model_name: str
    List[UploadFile] - files to send

Output:
    null
```

### Clear rag files

```DELETE /heavy/rag/clearragfiles```

Clear RAG documents

```html request
Input:
    model_name: string - Name of the model for sending file to.

Output:
    null
```