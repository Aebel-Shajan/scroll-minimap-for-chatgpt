import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OptionsPage from './OptionsPage/OptionsPage.tsx'
import './index.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <OptionsPage />
    </MantineProvider>
  </StrictMode>,
)
