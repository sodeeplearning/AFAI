import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { AxiosResponse } from "axios";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
import { getAllModels } from "shared/api/services/GetAllModels/api";


export class CatalogAnimeStoreReleases {
    constructor() {
        makeAutoObservable(this);
    }

    releasesData?: IPromiseBasedObservable<AxiosResponse<GetAllModelsResponse[]>>

    getAllModelsAction = async () => {
        try {
            console.log("getAllModelsAction");
            this.releasesData =
                fromPromise<AxiosResponse<GetAllModelsResponse[]>>(
                    getAllModels()
                );
            console.log(this.releasesData, 'releasesData');
        } catch (error) {
            console.log(error);
        }
    }
}

