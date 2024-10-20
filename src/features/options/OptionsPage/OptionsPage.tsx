import { useEffect, useState } from 'react'
import styles from './OptionsPage.module.css'
import logoImage from '../../../assets/logo.png'
import { AppShell, Button, Checkbox, Group, Slider, Stack, Text, Title } from '@mantine/core';

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

const OptionsPage = () => {
  // states
  const [keepOpen, setKeepOpen] = useState<boolean>(defaultOptions["keepOpen"])
  const [smoothScrolling, setSmoothScrolling] = useState<boolean>(defaultOptions["smoothScrolling"])
  const [autoRefresh, setAutoRefresh] = useState<boolean>(defaultOptions["autoRefresh"])
  const [refreshPeriod, setRefreshPeriod] = useState<number>(defaultOptions["refreshPeriod"])
  
  // helper functions
  function handleChangeCheckbox(setter: CallableFunction) {
    return (event: React.ChangeEvent<HTMLInputElement>) => setter(event.currentTarget.checked)
  }
  function handleChangeSlider(setter: CallableFunction) {
    return (sliderValue: number) => setter(sliderValue)
  }
  function handleResetToDefault() {
    setKeepOpen(defaultOptions.keepOpen)
    setSmoothScrolling(defaultOptions.smoothScrolling)
    setAutoRefresh(defaultOptions.autoRefresh)
    setRefreshPeriod(defaultOptions.refreshPeriod)
  }

  // On initial render
  useEffect(() => {
    chrome.storage.sync.get(['settings'], function(data) {
      const settings = {...data.settings}
      setKeepOpen(settings.keepOpen)
      setSmoothScrolling(settings.smoothScrolling)
      setAutoRefresh(settings.autoRefresh)
      setRefreshPeriod(settings.refreshPeriod)
  });
  }, [])

  // On options change
  useEffect(() => {
    const settings: ExtensionOptions = {
      keepOpen: keepOpen,
      smoothScrolling: smoothScrolling,
      autoRefresh: autoRefresh,
      refreshPeriod: refreshPeriod
    }
    chrome.storage.sync.set({
      settings: settings
    })
  }, [keepOpen, smoothScrolling, autoRefresh, refreshPeriod])

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
            <Button
              onClick={handleResetToDefault}
            >
            Reset to default
            </Button>
          </Stack>
          
          </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default OptionsPage;
