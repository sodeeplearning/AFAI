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

    const modelName = message.model;

    const renderContent = () => {
        if (role === 'assistant') {
            if (content.includes('</think>')) {
                const parts = content.split('</think>');
                const thinkPart = parts[0].replace('<think>', '').trim();
                const mainContent = parts.length > 1 ? parts[1].trim() : '';
                
                return (
                    <Card className={s.assistantCard}>
                        <div className={s.modelName}>{modelName}</div>
                        <div className={s.thinkPart}>{thinkPart}</div>
                        <div className={s.messageContent}>{mainContent}</div>
                    </Card>
                );
            }
            return (
                <div className={s.messageContent}>
                    <div className={s.modelName}>{modelName}</div>
                    {content}
                </div>
            );
        }
        return (
            <div className={s.messageContent}>
                {content}
            </div>
        );
    };

    return (
        <div className={classNames(s.messageItem, mods, [className])}>
            {renderContent()}
        </div>
    );
});
