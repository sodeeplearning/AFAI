import { observer } from "mobx-react-lite"
import { AskPanel } from "widgets/AskPanel"
import { Page } from "widgets/Page/Page"
import s from './MainPage.module.scss'
import { ChatHistoryList } from "entities/Chat/ui/ChatHistoryList/ChatHistoryList"  
import { useStore } from "app/providers/StoreProvider"
import { useEffect, useState } from "react"
import { ChatMessage } from "shared/api/services/GetChatHistory/types"

export const MainPage = observer(() => {
    const { getChatHistoryStore, generationOnlyTextStore } = useStore()
    const [selectedModel, setSelectedModel] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            await getChatHistoryStore.getAllModelsAction();
        };
        fetchData();
    }, [getChatHistoryStore]);

    useEffect(() => {
        if (generationOnlyTextStore.chatHistoryData.isFulfilled) {
            getChatHistoryStore.getAllModelsAction();
        }
    }, [generationOnlyTextStore.chatHistoryData.isFulfilled, getChatHistoryStore]);

    console.log('getChatHistoryStore.getChatHistoryData?.value:', getChatHistoryStore.getChatHistoryData?.value);
    const messages = getChatHistoryStore.getChatHistoryData?.value
        ? Object.entries(getChatHistoryStore.getChatHistoryData.value).flatMap(([model, msgs]) =>
            (msgs as ChatMessage[]).map(msg => ({ ...msg, model }))
          )
        : [];

    console.log('messages:', messages);

    return (
        <Page>
            <ChatHistoryList
                messages={messages}
                isLoading={getChatHistoryStore.getChatHistoryData?.state === 'pending'}
                selectedModel={selectedModel}
            />
            <AskPanel 
                className={s.askPanel} 
                onSelectModel={setSelectedModel}
            />
        </Page>
    )
})

export default MainPage