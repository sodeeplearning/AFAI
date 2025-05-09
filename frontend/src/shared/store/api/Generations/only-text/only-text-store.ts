import { makeAutoObservable } from "mobx";
import { onlyTextService } from "shared/api/services/Generations/OnlyText/api";
import { GenerateTextResponse } from "shared/api/services/Generations/OnlyText/types";
import { GetChatHistoryResponse } from "shared/api/services/GetChatHistory/types";
import { getChatHistory } from "shared/api/services/GetChatHistory/api";
import { MobxSaiInstance, mobxSaiFetch, mobxSaiHandler } from "mobx-toolbox";
import { getModelHistory } from "shared/api/services/GetModelHistory/api";

export class GenerationOnlyTextStore {
    constructor() {
        makeAutoObservable(this);
    }

    generationOnlyTextData: MobxSaiInstance<GenerateTextResponse> = {}
    chatHistoryData: MobxSaiInstance<GetChatHistoryResponse> = {}

    generationOnlyTextAction = async (prompt: string, model: string) => {
        try {
            this.generationOnlyTextData = mobxSaiFetch(
                async () => {
                    const response = await onlyTextService({
                        prompt: prompt,
                        model_name: model
                    });
                    return response.data;
                }
            );

            mobxSaiHandler(
                this.generationOnlyTextData,
                () => {
                    this.updateModelHistory(model);
                    this.updateChatHistory();
                },
                (error) => {
                    console.error("Generation failed:", error);
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    updateChatHistory = async () => {
        try {
            this.chatHistoryData = mobxSaiFetch(
                async () => {
                    const response = await getChatHistory();
                    return response.data;
                }
            );

            mobxSaiHandler(
                this.chatHistoryData,
                () => {
                    console.log("Chat history updated");
                },
                (error) => {
                    console.error("Chat history update failed:", error);
                }
            );
        } catch (error) {
            console.log("Error updating chat history:", error);
        }
    }

    updateModelHistory = async (model: string) => {
        try {
            this.chatHistoryData = mobxSaiFetch(
                async () => {
                    const response = await getModelHistory(model);
                    return response.data;
                }
            );

            mobxSaiHandler(
                this.chatHistoryData,
                () => {
                    console.log("Chat history updated");
                },
                (error) => {
                    console.error("Chat history update failed:", error);
                }
            );
        } catch (error) {
            console.log("Error updating chat history:", error);
        }
    }
}