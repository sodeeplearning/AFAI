import { Modal, Input, Form, message } from "antd"
import { useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "app/providers/StoreProvider"

const { TextArea } = Input

interface AddPromptProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    model: string
    isCentered: boolean
}

export const AddPrompt = observer((props: AddPromptProps) => {
    const {
        isOpen,
        onClose,
        onConfirm,
        model,
        isCentered
    } = props
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const { addSystemPromptStore } = useStore()

    const handleCancel = () => {
        form.resetFields()
        onClose()
    }

    const handleSubmit = useCallback(async () => {
        try {
            const values = await form.validateFields()
            setIsSubmitting(true)

            await addSystemPromptStore.addSystemPromptAction(
                model || values.model,
                values.prompt
            )

            messageApi.success("Промпт успешно добавлен")
            form.resetFields()
            onConfirm()
        } catch (error) {
            if (error instanceof Error) {
                messageApi.error(error.message)
            } else {
                messageApi.error("Ошибка при добавлении промпта")
            }
        } finally {
            setIsSubmitting(false)
        }
    }, [addSystemPromptStore, form, messageApi, model, onConfirm])
    return (
        <>
            {contextHolder}
            <Modal
                title="Добавить промпт модели"
                open={isOpen}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText="Добавить"
                cancelText="Отмена"
                confirmLoading={isSubmitting}
                centered={isCentered}
            >
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="model"
                        label="Модель"
                        initialValue={model}
                        rules={[{ required: !model, message: "Выберите модель" }]}
                    >
                        {model}
                    </Form.Item>
                    <Form.Item
                        name="prompt"
                        label="Промпт"
                        rules={[{ required: true, message: "Введите текст промпта" }]}
                    >
                        <TextArea
                            placeholder="Введите системный промпт..."
                            rows={6}
                            showCount
                            maxLength={2000}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})
