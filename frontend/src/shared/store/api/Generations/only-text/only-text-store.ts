import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { onlyTextService } from "shared/api/services/Generations/OnlyText/api";
import { GenerateTextResponse } from "shared/api/services/Generations/OnlyText/types";

export class GenerationOnlyTextStore {
    constructor() {
        makeAutoObservable(this);
    }

    generationOnlyTextData?: IPromiseBasedObservable<AxiosResponse<GenerateTextResponse>>

    generationOnlyTextAction = async (prompt: string, model: string) => {
        try {
            console.log("generationOnlyTextAction");
            this.generationOnlyTextData = fromPromise<AxiosResponse<GenerateTextResponse>>(
                onlyTextService({
                    prompt: prompt,
                    model_name: model
                })
            );
            console.log(this.generationOnlyTextData, 'generationOnlyTextData');
        } catch (error) {
            console.log(error);
        }
    }
}