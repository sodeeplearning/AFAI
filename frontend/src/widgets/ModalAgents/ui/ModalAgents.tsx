import { Button, Modal, Typography } from "antd"
import { ReactNode } from "react"

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
        isCentered
    } = props
    
    return (
        <Modal
            title={title}
            open={isOpen}
            onCancel={onClose}
            centered={isCentered}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {cancelText}
                </Button>,
                <Button key="confirm" type="primary" onClick={onConfirm}>
                    {confirmText}
                </Button>
            ]}
        >
            <Text>{modalText} <Text strong>{model}</Text>?</Text>
            {children}
        </Modal>
    )
}
