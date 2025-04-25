import { Card, Typography } from 'antd';
import classNames from 'shared/library/classNames/classNames';
import s from './AIMessage.module.scss';

const { Text, Paragraph } = Typography;

interface AIMessageProps {
    className?: string;
    content: string;
}

// TODO: переделать

export const AIMessage = ({ className, content }: AIMessageProps) => {
    const parseContent = (text: string): { thinking: string | null; response: string } => {
        const thinkMatch = text.match(/<think>(.*?)<\/think>/s);
        const thinking = thinkMatch ? thinkMatch[1].trim() : null;
        const response = text.replace(/<think>.*?<\/think>/s, '').trim();
        
        return { thinking, response };
    };

    const { thinking, response } = parseContent(content);

    return (
        <Card className={classNames(s.aiMessage, {}, [className])}>
            {thinking && (
                <div className={s.thinkingSection}>
                    <Text className={s.thinkingLabel}>Thinking process:</Text>
                    <Paragraph className={s.thinkingContent}>
                        {thinking}
                    </Paragraph>
                </div>
            )}
            <div className={s.responseSection}>
                <Paragraph className={s.responseContent}>
                    {response}
                </Paragraph>
            </div>
        </Card>
    );
}; 