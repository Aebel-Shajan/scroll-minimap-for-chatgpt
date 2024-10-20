import { useState } from 'react'
import styles from './OptionsPage.module.css'
import logoImage from '../../../assets/logo.png'
import { AppShell, Checkbox, Group, Slider, Stack, Text, Title } from '@mantine/core';

interface ExtensionOptions {
  keepOpen: boolean,
  smoothScrolling: boolean,
  autoRefresh: boolean,
  refreshPeriod: number
}

let defaultOptions: ExtensionOptions ={
  keepOpen: false,
  smoothScrolling: true,
  autoRefresh: false,
  refreshPeriod: 10
}

function OptionsPage() {
  const [options, setOptions] = useState<ExtensionOptions>(defaultOptions)
  const [keepOpen, setKeepOpen] = useState<boolean>(defaultOptions["keepOpen"])
  const [smoothScrolling, setSmoothScrolling] = useState<boolean>(defaultOptions["smoothScrolling"])
  const [autoRefresh, setAutoRefresh] = useState<boolean>(defaultOptions["autoRefresh"])
  const [refreshPeriod, setRefreshPeriod] = useState<number>(defaultOptions["refreshPeriod"])
  
  
  function handleChangeCheckbox(setter: CallableFunction) {
    return (event: React.ChangeEvent<HTMLInputElement>) => setter(event.currentTarget.checked)
  }

  function handleChangeSlider(setter: CallableFunction) {
    return (sliderValue: number) => setter(sliderValue)
  }

  return (
    <AppShell
      header={{height: 100}}>
      <AppShell.Header className={styles.header}>
        <Group className='header-content-container'>
        <img src={logoImage} />
        <Title order={1}>ChatGPT Scroll Map</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Main className={styles.main}>
        <div>
          <Stack>
            <Checkbox
              label="Keep minimap open"
              checked={keepOpen}
              onChange={handleChangeCheckbox(setKeepOpen)}/>
            <Checkbox
              label="Enable smooth scrolling"
              checked={smoothScrolling}
              onChange={handleChangeCheckbox(setSmoothScrolling)}/>
            <Checkbox
              label="Enable auto refresh"
              checked={autoRefresh}
              onChange={handleChangeCheckbox(setAutoRefresh)} />
            <div>
              <Text td={!autoRefresh? "line-through": ""}>
                Refresh period: {refreshPeriod}
              </Text>
            <Slider 
              disabled={!autoRefresh}
              min={0.5} 
              max={10}
              step={0.5}
              value={refreshPeriod}
              onChange={handleChangeSlider(setRefreshPeriod)}
            />
            </div>
          </Stack>
          </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default OptionsPage;
