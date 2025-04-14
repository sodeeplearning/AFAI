import { AgentsList } from "entities/Agents/ui/AgentsList/AgentsList"
import { Page } from "widgets/Page/Page"
import s from './Agents.module.scss'



export const AgentsPage = () => {
    return (
        <Page className={s.agentsPage}>
            <AgentsList />
        </Page>
    )
}

export default AgentsPage