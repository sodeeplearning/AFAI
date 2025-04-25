
export interface SpeechToTextRequest {
    model_name: string;
    audio_files: string[];
    audio_links: string[];
}


export interface SpeechToTextResponse {
  texts: string[];
}
