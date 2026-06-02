import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Auto-update service worker every hour
registerSW({ immediate: true, onRegisteredSW(swUrl, r) {
  if (r) setInterval(() => r.update(), 60 * 60 * 1000)
}})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
