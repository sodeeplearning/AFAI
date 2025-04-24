import { Button, Card, Typography } from "antd"
import { useStore } from "app/providers/StoreProvider";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react"
import { PageLoader } from "widgets/PageLoader/ui/PageLoader";
import s from "./AgentsList.module.scss";
import { useTranslation } from "react-i18next";
import { ModalAgents } from "widgets/ModalAgents";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
const { Text } = Typography

export const AgentsList = observer(() => {
    const { getAllModelsStore, downloadModelStore } = useStore();
    const { t } = useTranslation()
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getAllModelsStore.getAllModelsAction();
        };
        fetchData();
    }, [getAllModelsStore]);

    const handleModelClick = (model: string) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedModel("");
    };

    const handleDownload = async () => {
        await downloadModelStore.downloadModelAction(selectedModel);
        handleModalClose();
    };

    if (getAllModelsStore.getAllModelsData?.state === "pending") {
        return <PageLoader />
    }

    return (
        <Card className={s.agentsList}>
            <Text className={s.agentsListTitle}>{t("Все модели доступные для скачивания")}</Text>
            {getAllModelsStore.getAllModelsData?.value ? (
                (getAllModelsStore.getAllModelsData.value as GetAllModelsResponse).data.map((model: string, index: number) => (
                    <Card key={`model-${index}`} className={s.agentCard}>
                        <Button
                            type="default"
                            onClick={() => handleModelClick(model)}
                        >
                            {model}
                        </Button>
                        
                    </Card>
                ))
            ) : (
                <Text>{t("Нет доступных моделей")}</Text>
            )}
            <ModalAgents
                title={t("Скачать модель")}
                cancelText={t("Отмена")}
                confirmText={t("Скачать")}
                modalText={t("Вы действительно хотите скачать модель")}
                isCentered={true}
                model={selectedModel}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleDownload}
                successMessage={t("Модель в процессе скачивания")}
            >
                <div className={s.modalContent}/>
                    <Text className={s.modalText}>{t("* Скачивание модели может занять некоторое время")}</Text>
            </ModalAgents>
        </Card>
    )
})