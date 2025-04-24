import { Modal, Input, Form, message } from "antd"
import { useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "app/providers/StoreProvider"
import { useTranslation } from "react-i18next"

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
    const { t } = useTranslation()
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

            messageApi.success(`${t("Промпт успешно добавлен")}`)
            form.resetFields()
            onConfirm()
        } catch (error) {
            if (error instanceof Error) {
                messageApi.error(error.message)
            } else {
                messageApi.error(`${t("Ошибка при добавлении промпта")}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }, [addSystemPromptStore, form, messageApi, model, onConfirm, t])
    return (
        <>
            {contextHolder}
            <Modal
                title={`${t("Добавить промпт модели")}`}
                open={isOpen}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText={`${t("Добавить")}`}
                cancelText={`${t("Отмена")}`}
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
                        label={`${t("Модель")}`}
                        initialValue={model}
                        rules={[{ required: !model, message: `${t("Выберите модель")}` }]}
                    >
                        {model}
                    </Form.Item>
                    <Form.Item
                        name="prompt"
                        label={`${t("Промпт")}`}
                        rules={[{ required: true, message: `${t("Введите текст промпта")}` }]}
                    >
                        <TextArea
                            placeholder={`${t("Введите системный промпт...")}`}
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
