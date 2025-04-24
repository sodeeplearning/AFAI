import { Button, Modal, Typography, message } from "antd"
import { ReactNode, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

const { Text } = Typography

interface ModalAgentsProps {
    model: string
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    children?: ReactNode
    title?: string
    confirmText?: string
    cancelText?: string
    modalText?: string
    isCentered?: boolean
    successMessage?: string
}

export const ModalAgents = (props: ModalAgentsProps) => {
    const {
        model,
        isOpen,
        onClose,
        onConfirm,
        children,
        title,
        confirmText,
        cancelText,
        modalText,
        isCentered,
        successMessage
    } = props
    
    const { t } = useTranslation()
    const [messageApi, contextHolder] = message.useMessage()
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const handleConfirm = useCallback(async () => {
        try {
            setIsSubmitting(true)
            await onConfirm()
            messageApi.success(successMessage || t("Операция выполнена успешно"))
        } catch (error) {
            if (error instanceof Error) {
                messageApi.error(error.message)
            } else {
                messageApi.error(t("Произошла ошибка"))
            }
        } finally {
            setIsSubmitting(false)
            onClose()
        }
    }, [messageApi, onConfirm, onClose, successMessage, t])
    
    return (
        <>
            {contextHolder}
            <Modal
                title={title}
                open={isOpen}
                onCancel={onClose}
                centered={isCentered}
                onOk={handleConfirm}
                footer={[
                    <Button key="cancel" onClick={onClose} disabled={isSubmitting}>
                        {cancelText}
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleConfirm} loading={isSubmitting}>
                        {confirmText}
                    </Button>
                ]}
            >
                <Text>{modalText} <Text strong>{model}</Text>?</Text>
                {children}
            </Modal>
        </>
    )
}
