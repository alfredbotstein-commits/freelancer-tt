import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as Sentry from "@sentry/react"
import { initRevenueCat } from "./revenueCat"
import "./index.css"
import App from "./App.jsx"

Sentry.init({
  dsn: "NEEDS_KEY",
  integrations: [],
  environment: "production",
  tracesSampleRate: 0.1,
})

initRevenueCat();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="p-4 text-center text-red-500">Something went wrong. Please restart the app.</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
