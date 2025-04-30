import { Card } from "antd"
import s from "./AskPanel.module.scss"
import classNames from "shared/library/classNames/classNames"
import { AccessibleAgents } from "../AccessibleAgents/AccessibleAgents"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { SendMessageToAgent } from "features/SendMessageToAgent"



interface AskPanelProps {
    className?: string;
    onSelectModel?: (model: string) => void;
}

export const AskPanel = observer(({ className, onSelectModel }: AskPanelProps) => {
    const [selectedModel, setSelectedModel] = useState<string>("")

    const handleModelSelect = (model: string) => {
        setSelectedModel(model);
        onSelectModel?.(model);
    };

    return (
        <div className={classNames(s.askPanel, {}, [className])}>
            <div className={s.inputWrapper}>
                <AccessibleAgents
                    className={s.accessibleAgents}
                    onSelectModel={handleModelSelect}
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
