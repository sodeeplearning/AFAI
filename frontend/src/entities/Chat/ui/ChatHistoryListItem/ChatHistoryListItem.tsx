import { ChatMessage } from 'shared/api/services/GetChatHistory/types';
import { classNames, Mods } from 'shared/library/classNames/classNames';
import s from './ChatHistoryListItem.module.scss';
import { observer } from 'mobx-react-lite';
import { Card } from 'antd';

interface ChatHistoryListItemProps {
    message: ChatMessage;
    className?: string;
}

export const ChatHistoryListItem = observer(({ message, className }: ChatHistoryListItemProps) => {
    const { role, content } = message;

    const mods: Mods = {
        [s.userMessage]: role === 'user',
        [s.assistantMessage]: role === 'assistant',
        [s.systemMessage]: role === 'system',
    };

    if (role === 'system') return null;

    const renderContent = () => {
        if (role === 'assistant') {
            const thinkMatch = content.match(/<think>(.*?)<\/think>/s);
            if (thinkMatch) {
                const thinkPart = thinkMatch[1].trim();
                const mainContent = content.replace(/<think>.*?<\/think>/s, '').trim();
                return (
                    <Card className={s.assistantCard}>
                        <div className={s.thinkPart}>{thinkPart}</div>
                        <div className={s.messageContent}>{mainContent}</div>
                    </Card>
                );
            }
        }
        return <div className={s.messageContent}>{content}</div>;
    };

    return (
        <div className={classNames(s.messageItem, mods, [className])}>
            {renderContent()}
        </div>
    );
});
