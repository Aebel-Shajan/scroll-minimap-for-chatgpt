import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const contentRoot = document.createElement('div')
contentRoot.id = 'content-root'
document.body.appendChild(contentRoot)

createRoot(contentRoot).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
