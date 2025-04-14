import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
import { getAllModels } from "shared/api/services/GetAllModels/api";

export class GetAllModelsStore {
    constructor() {
        makeAutoObservable(this);
    }

    getAllModelsData?: IPromiseBasedObservable<AxiosResponse<GetAllModelsResponse[]>>

    getAllModelsAction = async () => {
        try {
            console.log("getAllModelsAction");
            this.getAllModelsData = fromPromise<AxiosResponse<GetAllModelsResponse[]>>(
                getAllModels()
            );
            console.log(this.getAllModelsData, 'getAllModelsData');
        } catch (error) {
            console.log(error);
        }
    }
}

