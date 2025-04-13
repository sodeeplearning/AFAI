import classNames from "shared/library/classNames/classNames"
import { AppRouter, LayoutWrapper } from "./providers/router"
import { useTheme } from "./providers/ThemeProvider"
import { Suspense } from "react"
import { RootStoreContext } from "./providers/StoreProvider"
import { RootStore } from "shared/store/root-store"
import { observer } from "mobx-react-lite"

const rootStore = new RootStore()

export const  App = observer(() => {
  const { theme } = useTheme()

  return (
    <RootStoreContext.Provider value={rootStore}>
      <div className={classNames('app', {}, [theme])}>
        <Suspense fallback="" >
          <LayoutWrapper>
            <AppRouter />
          </LayoutWrapper>
        </Suspense>
      </div>
    </RootStoreContext.Provider>
  )
})

export default App