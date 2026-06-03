import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

registerSW({
  immediate: true,
  onOfflineReady() {
    // App is cached and ready to work offline
    window.dispatchEvent(new CustomEvent('pwa-offline-ready'))
  },
  onNeedRefresh() {
    // New version available — autoUpdate will handle it silently
  },
  onRegisteredSW(swUrl, r) {
    // Check for updates every hour
    if (r) setInterval(() => r.update(), 60 * 60 * 1000)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
