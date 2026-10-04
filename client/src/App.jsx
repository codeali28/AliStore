import './App.scss'
import "bootstrap/dist/js/bootstrap.bundle"

import Routes from "./pages/Routes"
import ScreenLoader from './components/Misc/ScreenLoader'

import { useAuth } from "./context/Auth"
import { ConfigProvider } from 'antd'

const App = () => {
  const { isAppLoading } = useAuth()

  return (
    <> 
      {!isAppLoading ? <Routes /> : <ScreenLoader />}
    </>
  )
}
export default App



