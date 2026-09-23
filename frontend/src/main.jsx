import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <StrictMode>
        <Toaster
                position="top-right"
                richColors
                closeButton
            />
        <App />
      </StrictMode>,
    </BrowserRouter>
  </AuthProvider>
)
