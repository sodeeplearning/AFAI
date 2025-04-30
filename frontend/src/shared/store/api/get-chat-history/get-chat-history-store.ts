import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { GetChatHistoryResponse } from "shared/api/services/GetChatHistory/types";
import { getChatHistory } from "shared/api/services/GetChatHistory/api";

export class GetChatHistoryStore {
    constructor() {
        makeAutoObservable(this);
    }

    getChatHistoryData?: IPromiseBasedObservable<AxiosResponse<GetChatHistoryResponse>>

    getAllModelsAction = async () => {
        try {
            console.log("getChatHistoryAction");
            this.getChatHistoryData = fromPromise<AxiosResponse<GetChatHistoryResponse>>(
                getChatHistory()
            );
            console.log(this.getChatHistoryData, 'getChatHistoryData');
        } catch (error) {
            console.log(error);
        }
    }
}