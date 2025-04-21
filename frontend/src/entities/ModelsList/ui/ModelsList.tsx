import { Alert, Button, Flex, Space, Table } from "antd";
import { observer } from "mobx-react-lite";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
import s from './ModelsList.module.scss'
import classNames from "shared/library/classNames/classNames";
import { ModalAgents } from "widgets/ModalAgents";

interface ModelsListProps {
    models: GetAllModelsResponse;
    children: ReactNode;
    isLoading: boolean;
    error: string | null;
    onDelete?: (modelName: string) => void;
    onEdit?: (modelName: string) => void;
    className?: string;
}

export const ModelsList = observer((props: ModelsListProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const { t } = useTranslation();
    const {
        models,
        children,
        isLoading,
        error,
        onDelete,
        onEdit,
        className
    } = props

    const renderActions = (record: { name: string }) => {
        return (
            <Space size="small">
                <Button
                    type="default"
                    onClick={() => setIsModalOpen(true)}
                >
                    {t("edit")}
                </Button>
                <Button
                    type="primary"
                    onClick={() => setIsModalOpenDelete(true)}
                >
                    {t("delete")}
                </Button>
                <ModalAgents
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => onEdit?.(record.name)}
                    model={record.name}
                    isCentered={false}
                />
                <ModalAgents
                    isOpen={isModalOpenDelete}
                    title={t("Удалить модель")}
                    cancelText={t("Отмена")}
                    confirmText={t("Удалить")}
                    onClose={() => setIsModalOpenDelete(false)}
                    onConfirm={() => onDelete?.(record.name)}
                    model={record.name}
                    isCentered={true}
                    modalText={t("Вы действительно хотите удалить модель")}
                />
            </Space>
        )
    }

    const columns = [
        {
            title: `${t("model")}`,
            dataIndex: "name",
            key: "name",
        },
        {
            title: `${t("actions")}`,
            key: "actions",
            render: renderActions
        }
    ]
    return (
        <Flex vertical align="start" gap={16} className={classNames('', {}, [className])}>
            {error && <Alert message="Error" type="error" />}
            <Table
                className={s.table}
                columns={columns}
                dataSource={models?.data.map(name => ({ name }))}
                children={children}
                pagination={false}
                rowKey="name"
                loading={isLoading}
            />
        </Flex>
    )
})