

export interface TextToSpeechRequest {
    model_name: string;
    prompt: string; 
}


export interface TextToSpeechResponse {
    audio_url: string;
}