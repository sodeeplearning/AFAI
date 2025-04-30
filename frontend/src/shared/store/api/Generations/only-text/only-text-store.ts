import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { onlyTextService } from "shared/api/services/Generations/OnlyText/api";
import { GenerateTextResponse } from "shared/api/services/Generations/OnlyText/types";
import { GetChatHistoryResponse } from "shared/api/services/GetChatHistory/types";
import { getChatHistory } from "shared/api/services/GetChatHistory/api";
import { mobxSaiHandler } from "mobx-toolbox";

export class GenerationOnlyTextStore {
    constructor() {
        makeAutoObservable(this);
    }

    generationOnlyTextData?: IPromiseBasedObservable<AxiosResponse<GenerateTextResponse>>
    chatHistoryData?: IPromiseBasedObservable<AxiosResponse<GetChatHistoryResponse>>

    generationOnlyTextAction = async (prompt: string, model: string) => {
        try {
            this.generationOnlyTextData = fromPromise(
                onlyTextService({
                    prompt: prompt,
                    model_name: model
                })
            );

            this.generationOnlyTextData.case({
                fulfilled: () => {
                    this.updateChatHistory();
                },
                rejected: (error) => {
                    console.error("Generation failed:", error);
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    updateChatHistory = () => {
        try {
            this.chatHistoryData = fromPromise<AxiosResponse<GetChatHistoryResponse>>(
                getChatHistory()
            );
        } catch (error) {
            console.log("Error updating chat history:", error);
        }
    }
}