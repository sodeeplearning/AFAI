import { FC, useEffect, useState } from 'react';
import { Layout, Flex, message } from 'antd';
import classNames from 'shared/library/classNames/classNames';
import { ChatHistoryWidget } from 'widgets/ChatHistory';
import { ChatHistory } from 'shared/api/services/GetChatHistory/types';
import s from './ChatPage.module.scss';

interface ChatPageProps {
    className?: string;
}

const { Content, Sider } = Layout;

// Пример данных истории чата
const mockChatHistory: ChatHistory = {
    'GPT-4': [
        { id: '1', content: 'Привет! Как я могу помочь вам сегодня?', role: 'assistant' },
        { id: '2', content: 'Мне нужна помощь с разработкой структуры для хранения истории чата', role: 'user' },
        { id: '3', content: 'Конечно! Я могу предложить несколько вариантов структуры данных для хранения истории чата.', role: 'assistant' },
        { id: '4', content: 'Расскажи подробнее о требованиях', role: 'user' },
        { id: '5', content: 'Для начала нужно определить, какие данные вы хотите хранить в истории чата...', role: 'assistant' },
    ],
    'DALL-E': [
        { id: '6', content: 'Создай изображение космического корабля в стиле киберпанк', role: 'user' },
        { id: '7', content: 'Изображение создано успешно', role: 'assistant' },
        { id: '8', content: 'Теперь сделай его в неоновых цветах', role: 'user' },
        { id: '9', content: 'Изображение обновлено с неоновыми цветами', role: 'assistant' },
    ],
    'Claude': [
        { id: '10', content: 'Как использовать Feature-Sliced Design в React проекте?', role: 'user' },
        { id: '11', content: 'Feature-Sliced Design (FSD) - это методология организации кода для frontend-приложений...', role: 'assistant' },
        { id: '12', content: 'Можешь привести пример структуры проекта?', role: 'user' },
        { id: '13', content: 'Конечно! Вот пример базовой структуры проекта с использованием FSD...', role: 'assistant' },
    ]
};

export const ChatPage: FC<ChatPageProps> = (props) => {
    const { className } = props;
    const [chatHistory, setChatHistory] = useState<ChatHistory | undefined>();
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    
    // Имитация загрузки данных
    useEffect(() => {
        setTimeout(() => {
            setChatHistory(mockChatHistory);
        }, 500);
    }, []);
    
    const handleModelSelect = (modelName: string) => {
        setSelectedModel(modelName);
        messageApi.success(`Выбрана модель: ${modelName}`);
        
        // Здесь можно добавить логику для загрузки истории чата с выбранной моделью
        // Например, вызов API для получения полной истории чата с этой моделью
        // или переход на другую страницу с детальной историей
    };
    
    return (
        <Layout className={classNames(s.ChatPage, {}, [className])}>
            {contextHolder}
            <Content className={s.content}>
                <Flex vertical gap={16} className={s.chatContainer}>
                    {/* Здесь будет основной интерфейс чата */}
                    <div className={s.chatInterface}>
                        {selectedModel && (
                            <div className={s.selectedModelChat}>
                                <h2>Чат с моделью: {selectedModel}</h2>
                                {chatHistory && chatHistory[selectedModel]?.map((message) => (
                                    <div 
                                        key={message.id} 
                                        className={classNames(s.chatMessage, {}, [s[message.role]])}
                                    >
                                        <p>{message.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!selectedModel && (
                            <div className={s.noModelSelected}>
                                <h2>Выберите модель из истории чата</h2>
                            </div>
                        )}
                    </div>
                    
                    {/* Виджет истории чата */}
                    <ChatHistoryWidget 
                        chatHistory={chatHistory} 
                        onModelSelect={handleModelSelect}
                    />
                </Flex>
            </Content>
            
            <Sider 
                className={s.sider}
                width={300}
                theme="light"
            >
                {/* Здесь может быть боковая панель с дополнительными функциями */}
            </Sider>
        </Layout>
    );
}; 