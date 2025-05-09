import classNames from "shared/library/classNames/classNames"
import s from './MessageHistoryList.module.scss'
import { Flex, Typography, Card } from "antd"
import { useTranslation } from "react-i18next"
import { ChatHistory } from "shared/api/services/GetChatHistory/types"
import { useRef } from "react"
import { Link, useParams } from "react-router-dom"

interface MessageHistoryListProps {
    className?: string;
    chatHistory?: ChatHistory;
    onModelSelect?: (modelName: string) => void;
}

const { Text } = Typography

export const MessageHistoryList = (props: MessageHistoryListProps) => {
    const { className, chatHistory } = props
    const { modelName } = useParams()
    const { t } = useTranslation()
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    if (!chatHistory) {
        return null
    }

    const renderCard = () => {
        return (
            <Flex vertical gap={16}>
                <Link to={`/chat/${modelName}`}>
                    {Object.entries(chatHistory).map(([modelName, messages]) => {
                        const displayMessages = messages.slice(0, 4)

                        return (
                            <Card
                                key={modelName}
                                className={s.modelCard}
                            >
                                <Flex vertical className={s.modelGroup}>
                                    <Text strong className={s.modelName}>{modelName}</Text>
                                    <div
                                        ref={messagesContainerRef}
                                        className={s.messagesContainer}
                                    >
                                        {displayMessages.map((message) => (
                                            <Text key={message.id} className={s.message}>
                                                {message.content}
                                            </Text>
                                        ))}
                                    </div>
                                </Flex>
                            </Card>
                        )
                    })}
                </Link>

            </Flex>
        )
    }

    return (
        <section className={classNames(s.MessageHistoryList, {}, [className])}>
            <Text className={s.title}>{t('История чата')}</Text>
            {renderCard()}
        </section>
    )
}