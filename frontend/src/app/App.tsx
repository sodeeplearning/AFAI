import classNames from "shared/library/classNames/classNames"
import { AppRouter, LayoutWrapper } from "./providers/router"
import { useTheme } from "./providers/ThemeProvider"
import { Suspense, useLayoutEffect } from "react"
import { RootStoreContext } from "./providers/StoreProvider"
import { RootStore } from "shared/store/root-store"
import { observer } from "mobx-react-lite"

// добавить после норм запросов
// import { useNavigate } from "react-router-dom"

const rootStore = new RootStore()

export const  App = observer(() => {
  const { theme } = useTheme()
  const { loginStore } = rootStore
  // const navigate = useNavigate();

  useLayoutEffect(() => {
    if(localStorage.getItem('token')) loginStore.checkAuth()
  }, [loginStore])

  // if(!loginStore.isAuth) navigate('/')

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