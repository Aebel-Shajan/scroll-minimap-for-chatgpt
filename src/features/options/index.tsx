import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OptionsPage from './OptionsPage/OptionsPage.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OptionsPage />
  </StrictMode>,
)
