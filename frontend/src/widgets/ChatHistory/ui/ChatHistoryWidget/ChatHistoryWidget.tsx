import { memo, useState } from 'react';
import { Card, Typography, Button } from 'antd';
import { HistoryOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import classNames from 'shared/library/classNames/classNames';
import { MessageHistoryList } from 'entities/Chat/ui/MessageHistoryList/MessageHistoryList';
import { ChatHistory } from 'shared/api/services/GetChatHistory/types';
import s from './ChatHistoryWidget.module.scss';

interface ChatHistoryWidgetProps {
    className?: string;
    chatHistory?: ChatHistory;
    onModelSelect?: (modelName: string) => void;
}

const { Title } = Typography;

export const ChatHistoryWidget = memo((props: ChatHistoryWidgetProps) => {
    const { className, chatHistory, onModelSelect } = props;
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    if (!chatHistory || Object.keys(chatHistory).length === 0) {
        return null;
    }

    return (
        <Card 
            className={classNames(s.ChatHistoryWidget, { [s.expanded]: !isCollapsed }, [className])}
            title={
                <div className={s.header}>
                    <HistoryOutlined className={s.icon} />
                    <Title level={5} className={s.title}>История чата</Title>
                </div>
            }
            extra={
                <Button 
                    type="text" 
                    onClick={toggleCollapse} 
                    icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
                />
            }
        >
            <div className={classNames(s.content, { [s.collapsed]: isCollapsed })}>
                <MessageHistoryList 
                    chatHistory={chatHistory} 
                    previewMessagesCount={isCollapsed ? 1 : 2}
                    onModelSelect={onModelSelect}
                />
            </div>
        </Card>
    );
}); 