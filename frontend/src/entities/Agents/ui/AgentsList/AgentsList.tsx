import { Button, Card, Typography } from "antd"
import { useStore } from "app/providers/StoreProvider";
import { observer } from "mobx-react-lite";
import { useEffect } from "react"
import { PageLoader } from "widgets/PageLoader/ui/PageLoader";
import s from "./AgentsList.module.scss";
import { useTranslation } from "react-i18next";

const { Text } = Typography

export const AgentsList = observer(() => {
    const { getAllModelsStore } = useStore();
    const { t } = useTranslation()

    useEffect(() => {
        const fetchData = async () => {
            await getAllModelsStore.getAllModelsAction();
        };
        fetchData();
    }, [getAllModelsStore]);

    if (getAllModelsStore.getAllModelsData?.state === "pending") {
        return <PageLoader />
    }

    return (
        <Card className={s.agentsList}>
            <Text className={s.agentsListTitle}>{t("Все модели доступные для скачивания")}</Text>
            {getAllModelsStore.getAllModelsData?.value ? (
                getAllModelsStore.getAllModelsData.value.data.map((model: string, index: number) => (
                    <Card key={`model-${index}`} className={s.agentCard}>
                        <Button
                        type="default"
                        onClick={() => {
                            console.log(model)
                        }}
                        >
                        {model}
                        </Button>
                    </Card>
                ))
            ) : (
                <Text>{t("Нет доступных моделей")}</Text>
            )}
        </Card>
    )
})
