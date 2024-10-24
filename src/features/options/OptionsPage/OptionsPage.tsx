import { useEffect, useState } from 'react'
import styles from './OptionsPage.module.css'
import logoImage from '../../../assets/logo.png'
import { AppShell, Button, Checkbox, Group, Slider, Stack, Text, Title } from '@mantine/core';
import { ExtensionOptions } from '../../../types/options';
import { DEFAULT_OPTIONS } from '../../../constants';

const OptionsPage = () => {
  // states
  const [keepOpen, setKeepOpen] = useState<boolean>(DEFAULT_OPTIONS["keepOpen"])
  const [smoothScrolling, setSmoothScrolling] = useState<boolean>(DEFAULT_OPTIONS["smoothScrolling"])
  const [autoRefresh, setAutoRefresh] = useState<boolean>(DEFAULT_OPTIONS["autoRefresh"])
  const [refreshPeriod, setRefreshPeriod] = useState<number>(DEFAULT_OPTIONS["refreshPeriod"])
  
  // helper functions
  function handleChangeCheckbox(setter: CallableFunction) {
    return (event: React.ChangeEvent<HTMLInputElement>) => setter(event.currentTarget.checked)
  }
  function handleChangeSlider(setter: CallableFunction) {
    return (sliderValue: number) => setter(sliderValue)
  }
  function handleResetToDefault() {
    setKeepOpen(DEFAULT_OPTIONS.keepOpen)
    setSmoothScrolling(DEFAULT_OPTIONS.smoothScrolling)
    setAutoRefresh(DEFAULT_OPTIONS.autoRefresh)
    setRefreshPeriod(DEFAULT_OPTIONS.refreshPeriod)
  }

  // On initial render
  useEffect(() => {
    chrome.storage.sync.get(['options'], function(data) {
      const options = {...data.options}
      if (options) {
        setKeepOpen(options.keepOpen)
        setSmoothScrolling(options.smoothScrolling)
        setAutoRefresh(options.autoRefresh)
        if (options.refreshPeriod) {
          setRefreshPeriod(options.refreshPeriod)
        }
      }
  });
  }, [])

  // On options change
  useEffect(() => {
    const options: ExtensionOptions = {
      keepOpen: keepOpen,
      smoothScrolling: smoothScrolling,
      autoRefresh: autoRefresh,
      refreshPeriod: refreshPeriod
    }
    chrome.storage.sync.set({
      options: options
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
          <Text>
            Make sure to refresh the page for the options to apply
          </Text>
            <Checkbox
              label="Keep minimap open"
              checked={keepOpen}
              onChange={handleChangeCheckbox(setKeepOpen)}/>
            <Checkbox
              label="Enable smooth scrolling"
              checked={smoothScrolling}
              onChange={handleChangeCheckbox(setSmoothScrolling)}/>
            <div>
            <Checkbox
              label="Enable auto refresh"
              checked={autoRefresh}
              onChange={handleChangeCheckbox(setAutoRefresh)}
              description={`Refresh every ${refreshPeriod} seconds.`}
              />
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
