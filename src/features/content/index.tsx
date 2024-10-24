import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ContentContainer from './ContentContainer/ContentContainer.tsx'
import './index.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core'

const contentRoot = document.createElement('div')
contentRoot.id = 'content-root'
document.body.appendChild(contentRoot)

setTimeout(() => {
  if (!document.querySelector("#content-root")) {
    document.body.appendChild(contentRoot)
  }
}, 3000) // Incase some other extension removes ours

createRoot(contentRoot).render(
  <StrictMode>
     <MantineProvider>
      <ContentContainer />
    </MantineProvider>
  </StrictMode>,
)
