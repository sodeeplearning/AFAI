export interface GenerateTextRequest {
    prompt: string;
    model: string;
}

export interface GenerateTextResponse {
    content: string;
}