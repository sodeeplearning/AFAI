import classNames from 'shared/library/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import s from './PageError.module.scss'

interface ErrorPageProps {
    className?: string;
}

export const ErrorPage = ({ className }: ErrorPageProps) => {
    const { t } = useTranslation();

    const reloadPage = () => {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    };

    return (
        <div className={classNames(s.PageError, {}, [className])}>
            <p>{t('Произошла непредвиденная ошибка')}</p>
            <Button type='primary' danger onClick={reloadPage}>
                {t('Обновить страницу')}
            </Button>
        </div>
    );
};

export default ErrorPage;
