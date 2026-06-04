import { useStore } from './store/useStore'
import LoginScreen from './screens/LoginScreen'
import VettedScreen from './screens/VettedScreen'
import AppShell from './components/AppShell'

export default function App() {
  const { isLoggedIn, isVetted } = useStore()
  if (isVetted)    return <VettedScreen />
  if (!isLoggedIn) return <LoginScreen />
  return <AppShell />
}
