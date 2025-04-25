export interface ImageToTextRequest {
    model_name: string;
    prompt: string;
    image_files: string[];
    image_links: string[];
}


export interface ImageToTextResponse {
    image_url: string;
}
