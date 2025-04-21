import { useStore } from "app/providers/StoreProvider"; 
import { ModelsList } from "entities/ModelsList";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
import { Card } from "antd";

export const SettingsPanel = observer(() => {
    const { getAllModelsStore } = useStore();
    useEffect(() => {
        const fetchData = async () => {
            await getAllModelsStore.getAllDownloadedModelsAction();
        };
        fetchData();
    }, [getAllModelsStore]);
    
    return (    
        <Card>
            <ModelsList 
                models={getAllModelsStore.getAllDownloadedModelsData?.value as GetAllModelsResponse}
                children={<div>Footer</div>}
                isLoading={getAllModelsStore.getAllDownloadedModelsData?.state === "pending"}
                error={getAllModelsStore.getAllDownloadedModelsData?.state === "rejected" ? "Error" : null}
            />
        </Card>
    )
})  