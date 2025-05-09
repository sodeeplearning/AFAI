import classNames from "shared/library/classNames/classNames";
import { observer } from "mobx-react-lite"
import s from './ChatHistoryList.module.scss'
import itemStyles from '../ChatHistoryListItem/ChatHistoryListItem.module.scss';
import { Loader } from "widgets/Loader";
import { ChatMessage } from "shared/api/services/GetChatHistory/types";
import { ChatHistoryListItem } from "../ChatHistoryListItem/ChatHistoryListItem";
import { Flex, Card } from "antd";

interface ChatHistoryListProps {
    className?: string;
    messages: ChatMessage[];
    isLoading?: boolean;
    selectedModel?: string;
}

export const ChatHistoryList = observer((props: ChatHistoryListProps) => {
    const {
        className,
        messages,
        isLoading,
        selectedModel
    } = props

    const filteredMessages = selectedModel
        ? messages.filter(msg => msg.model === selectedModel)
        : messages;

    const renderMessage = (message: ChatMessage) => {
        return (
            <ChatHistoryListItem
                message={message}
                key={message.id}
            />
        )
    }
    
    return (
        <section className={classNames(s.ChatHistoryList, {}, [className])}>
            {filteredMessages.map(renderMessage)}
            {isLoading && (
                <div className={classNames(itemStyles.messageItem, {}, [itemStyles.assistantMessage])}>
                    <Card className={itemStyles.assistantCard}>
                        <div className={itemStyles.modelName}>{selectedModel || 'Ассистент'}</div>
                        <Flex className={s.loader} justify="center">
                            <Loader />
                        </Flex>
                    </Card>
                </div>
            )}
        </section>
    )
})

export default ChatHistoryList
