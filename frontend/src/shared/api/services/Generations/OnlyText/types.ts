export interface GenerateTextRequest {
    prompt: string;
    model_name: string;
}

export interface GenerateTextResponse {
    content: string;
}