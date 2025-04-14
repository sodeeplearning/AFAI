import { observer } from "mobx-react-lite"
import { AskPanel } from "widgets/AskPanel"
import { Page } from "widgets/Page/Page"
import s from './MainPage.module.scss'


export const MainPage = observer(() => {
    return (
        <Page>
            <AskPanel className={s.askPanel} />
        </Page>
    )
})

export default MainPage