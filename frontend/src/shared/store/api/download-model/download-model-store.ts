import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { DownloadModel, CheckHeavyModel, DownloadHeavyModel } from "shared/api/services/DownloadModel/api";

export class DownloadModelStore {
    constructor() {
        makeAutoObservable(this);
    }

    downloadModelData?: IPromiseBasedObservable<AxiosResponse>
    model_is_heavy: boolean = false

    downloadModelAction = async (model_name: string) => {
        try {
            const checkResponse = await CheckHeavyModel(model_name);
            const isHeavy = checkResponse.data.is_heavy;

            this.model_is_heavy = isHeavy;

            if (isHeavy) {
                this.downloadModelData = fromPromise<AxiosResponse>(
                    DownloadHeavyModel(model_name)
                );
            } else {
                this.downloadModelData = fromPromise<AxiosResponse>(
                    DownloadModel(model_name)
                );
            }
        } catch (error) {
            console.error("Error checking model:", error);
        }
    }
}
