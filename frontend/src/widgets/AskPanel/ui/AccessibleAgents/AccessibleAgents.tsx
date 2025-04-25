import classNames from "shared/library/classNames/classNames"
import s from "./AccessibleAgents.module.scss"
import { observer } from "mobx-react-lite"
import { AccessibleAgentsItems } from "./AccesibleAgentItem"

interface AccessibleAgentsProps {
    className?: string;
    onSelectModel?: (model: string) => void;
}

export const AccessibleAgents = observer((props: AccessibleAgentsProps) => {
    const {
        className,
        onSelectModel
    } = props

    return (
        <section className={classNames(s.accessibleAgents, {}, [className])}>
            <AccessibleAgentsItems 
                className={s.accessibleAgentsItems} 
                onSelectModel={onSelectModel}
            />
        </section>
    )
})
