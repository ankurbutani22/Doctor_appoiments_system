import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextprovider from './context/AppContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextprovider>
      <DoctorContextProvider>
        <App />
      </DoctorContextProvider>
    </AppContextprovider>
  </BrowserRouter>,
)
