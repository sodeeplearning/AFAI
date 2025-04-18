import { Card, Input, Typography } from "antd"
import s from "./AskPanel.module.scss"
import classNames from "shared/library/classNames/classNames"
import { useTranslation } from "react-i18next"
import { Search } from "lucide-react"
import { AccessibleAgents } from "../AccessibleAgents/AccessibleAgents"

const { TextArea } = Input
const { Text } = Typography

interface AskPanelProps {
    className?: string
}

export const AskPanel = ({ className }: AskPanelProps) => {
    const { t } = useTranslation()
    return (
        <div className={classNames(s.askPanel, {}, [className])}>
            <Text className={s.inputText}>{t("Чем я могу помочь?")}</Text>
            <div className={s.inputWrapper}>
            <AccessibleAgents className={s.accessibleAgents} />
                <Card className={s.inputCard}>
                    <div className={s.textareaWrapper}>
                        <TextArea
                            autoSize
                            placeholder="Спросите что-нибудь..."
                        />
                        
                        <div className={s.controls}>
                            <Search className={s.icon} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
