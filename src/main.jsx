import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'

Sentry.init({
  dsn: 'https://placeholder@sentry.io/0',
  integrations: [],
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="p-4 text-center text-red-500">Something went wrong. Please restart the app.</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
