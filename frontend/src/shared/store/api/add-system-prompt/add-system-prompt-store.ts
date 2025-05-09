import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { AddSystemPrompt } from "shared/api/services/AddSystemPrompt/api";

export class AddSystemPromptStore {
    constructor() {
        makeAutoObservable(this);
    }

    addSystemPromptData?: IPromiseBasedObservable<AxiosResponse>

    addSystemPromptAction = async (model_name: string, system_prompt: string) => {
        try {
            this.addSystemPromptData = fromPromise<AxiosResponse>(
                AddSystemPrompt(model_name, system_prompt)
            );
            console.log(this.addSystemPromptData, 'addSystemPromptData');
        } catch (error) {
            console.error("Error checking model:", error);
        }
    }
}
