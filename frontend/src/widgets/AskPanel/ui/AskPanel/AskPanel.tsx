import { Card } from "antd"
import s from "./AskPanel.module.scss"
import classNames from "shared/library/classNames/classNames"
import { AccessibleAgents } from "../AccessibleAgents/AccessibleAgents"
import { observer } from "mobx-react-lite"
import { FC, useState } from "react"
import { SendMessageToAgent } from "features/SendMessageToAgent"



interface AskPanelProps {
    className?: string
}

export const AskPanel: FC<AskPanelProps> = observer(({ className }) => {
    const [selectedModel, setSelectedModel] = useState<string>("")

    return (
        <div className={classNames(s.askPanel, {}, [className])}>
            <div className={s.inputWrapper}>
                <AccessibleAgents
                    className={s.accessibleAgents}
                    onSelectModel={setSelectedModel}
                />
                <Card className={s.inputCard}>
                    <SendMessageToAgent
                        className={s.sendMessageToAgent}
                        selectedModel={selectedModel}
                    />
                </Card>
            </div>
        </div>
    )
})
