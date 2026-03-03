import './App.css'
import NavigationProvider from './Navigation.Provider'
import { RecoilRoot } from 'recoil'



function App() {
  return (
    <RecoilRoot>
      <NavigationProvider />
    </RecoilRoot>
  )
}

export default App
