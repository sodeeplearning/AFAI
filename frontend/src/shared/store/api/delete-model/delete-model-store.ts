import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { DeleteModel } from "shared/api/services/DeleteModel/api";

export class DeleteModelStore {
    constructor() {
        makeAutoObservable(this);
    }

    deleteModelData?: IPromiseBasedObservable<AxiosResponse>

    deleteModelAction = async (model_name: string) => {
        try {
            this.deleteModelData = fromPromise<AxiosResponse>(
                DeleteModel(model_name)
            );
        } catch (error) {
            console.error("Error checking model:", error);
        }
    }
}
