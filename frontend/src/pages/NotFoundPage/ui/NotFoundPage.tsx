import { useTranslation } from "react-i18next";
import s from './NotFoundPage.module.scss'
import { Page } from "widgets/Page/Page";


export const NotFoundPage = () => {
    const { t } = useTranslation();
    return (
        <Page className={s.NotFoundPage}>
            {t('Страница не найдена')}
        </Page>
    )
}

