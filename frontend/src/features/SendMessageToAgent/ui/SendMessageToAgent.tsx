import { Button, Input, message as antMessage } from "antd"
import { observer } from "mobx-react-lite"
import s from './SendMessageToAgent.module.scss'
import { useTranslation } from "react-i18next"
import { useStore } from "app/providers/StoreProvider"
import { useState } from "react"
import { ArrowUp } from "lucide-react"
import classNames from "shared/library/classNames/classNames"

const { TextArea } = Input

interface SendMessageToAgentProps {
    onSelectModel?: (model: string) => void;
    selectedModel: string;
    className?: string;
}

export const SendMessageToAgent = observer(({ selectedModel, className }: SendMessageToAgentProps) => {
    const { generationOnlyTextStore } = useStore()
    const [messageText, setMessageText] = useState("")

    const handleSend = async () => {
        try {
            await generationOnlyTextStore.generationOnlyTextAction(messageText, selectedModel)
            setMessageText("")
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error)
            antMessage.error("Произошла ошибка при обработке запроса")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const { t } = useTranslation()
    return (
        <div className={classNames(s.textareaWrapper, {}, [className])}>
            <TextArea
                autoSize
                placeholder={t("Спросите что-нибудь...")}
                onChange={(e) => setMessageText(e.target.value)}
                value={messageText}
                onKeyDown={handleKeyDown}
                disabled={generationOnlyTextStore.generationOnlyTextData.isPending}
            />

            <Button
                onClick={handleSend}
                type="primary"
                shape="circle"
                className={s.controls}
                disabled={!messageText.trim() || !selectedModel}
            >
                <ArrowUp className={s.icon} />
            </Button>
        </div>
    )
})
