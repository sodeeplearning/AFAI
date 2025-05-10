import classNames from 'shared/library/classNames/classNames';
import s from './ChatPage.module.scss';
import { Page } from 'widgets/Page/Page';

interface ChatPageProps {
    className?: string;
}

export const ChatPage = (props: ChatPageProps) => {
    const { className } = props

    return (
        <Page className={classNames(s.ChatPage, {}, [className])}>
            <div>
                asf
            </div>
        </Page>
    );
}; 

export default ChatPage;