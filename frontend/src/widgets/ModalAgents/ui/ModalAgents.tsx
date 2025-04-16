import { Button, Modal, Typography } from "antd"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

const { Text } = Typography

interface ModalAgentsProps {
    model: string
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    children: ReactNode
}

export const ModalAgents = (props: ModalAgentsProps) => {
    const {
        model,
        isOpen,
        onClose,
        onConfirm,
        children
    } = props
    const { t } = useTranslation()
    
    return (
        <Modal
            title={t("Подтверждение")}
            open={isOpen}
            onCancel={onClose}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("Отмена")}
                </Button>,
                <Button key="confirm" type="primary" onClick={onConfirm}>
                    {t("Скачать")}
                </Button>
            ]}
        >
            <Text>{t("Вы действительно хотите скачать модель")} <Text strong>{model}</Text>?</Text>
            {children}
        </Modal>
    )
}
