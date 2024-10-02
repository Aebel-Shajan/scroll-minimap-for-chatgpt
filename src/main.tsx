import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Frame from 'react-frame-component';


createRoot(document.getElementById('content-root')!).render(
  <StrictMode>
    <Frame
      head={[
        <link
          key='0'
          type='text/css'
          rel='stylesheet'
          href={chrome.runtime.getURL('/react/index.css')}
        />
      ]}
    >
    <App />
    </Frame>
  </StrictMode>,
)
