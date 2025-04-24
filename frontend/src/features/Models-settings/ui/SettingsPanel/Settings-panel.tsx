import { useStore } from "app/providers/StoreProvider";
import { ModelsList } from "entities/ModelsList";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
import { Card } from 'antd'
import { useTranslation } from "react-i18next";
export const SettingsPanel = observer(() => {
    const { getAllModelsStore, deleteModelStore } = useStore();
    const { t } = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            await getAllModelsStore.getAllDownloadedModelsAction();
        };
        fetchData();
    }, [getAllModelsStore]);

    const modelsData = getAllModelsStore.getAllDownloadedModelsData?.value as GetAllModelsResponse | undefined;

    if (!modelsData?.data || modelsData.data.length === 0) {
        return (
            <Card>
                <div>{t("Нет доступных моделей")}</div>
            </Card>
        )
    }

    return (
        <Card>
            <ModelsList
                models={modelsData}
                isLoading={getAllModelsStore.getAllDownloadedModelsData?.state === "pending"}
                error={getAllModelsStore.getAllDownloadedModelsData?.state === "rejected" ? "Error" : null}
                onDelete={deleteModelStore.deleteModelAction}
            />
        </Card>
    )
})  