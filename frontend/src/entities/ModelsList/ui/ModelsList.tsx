import { Alert, Flex, Skeleton, Table } from "antd";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";

interface ModelsListProps {
    models: GetAllModelsResponse;
    children: ReactNode;
    isLoading: boolean;
    error: string | null;
}

export const ModelsList = observer((props: ModelsListProps) => {
    const { t } = useTranslation();
    const {
        models,
        children,
        isLoading,
        error
    } = props

    const columns = [
        {
            title: `${t("model")}`,
        }
    ]
    return (
        <Flex vertical gap={16}>
            {error && <Alert message="Error" type="error" />}
            <Table
                columns={columns}
                dataSource={models?.data}
                children={children}
                pagination={false}
            />
            {isLoading && <Skeleton active />}
        </Flex>
    )
})