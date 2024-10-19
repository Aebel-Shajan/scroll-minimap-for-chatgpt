import { useState } from 'react'
import './OptionsPage.css'
import logoImage from '../../../assets/logo.png'

interface CheckboxProps {
  label: string,
  checkedInitially: boolean,
  onChange: CallableFunction
}

const CheckboxInput = ({ label, checkedInitially, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checkedInitially || false);
  const handleChange = (newValue: boolean) => {
    setIsChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div 
      className='checkbox option'
      onClick={() => handleChange(!isChecked)} 
      style={{userSelect: "none"}}>
      {label}
      <input
        type="checkbox"
        checked={isChecked}
      />
    </div>
  );
};

interface RangeProps {
  label: string,
  initialValue: number,
  onChange: CallableFunction,
  range: number[],
}

const RangeInput = ({label, initialValue, onChange, range}: RangeProps) => {
  const [value, setValue] = useState<number>(initialValue || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className='range option'>
      {label}
      <div>
      {value}
        <input
          type='range'
          value={value}
          onChange={handleChange}
          min={range[0]}
          max={range[1]}
          
          />
          
        </div>
    </div>
  )
}


interface ExtensionOptions {
  keepOpen: boolean,
  enableSmoothScrolling: boolean,
  enableAutoRefresh: boolean,
  refreshPeriod: number
}

let defaultOptions: ExtensionOptions ={
  keepOpen: false,
  enableSmoothScrolling: true,
  enableAutoRefresh: false,
  refreshPeriod: 10
}

function OptionsPage() {
  const [options, setOptions] = useState<ExtensionOptions>(defaultOptions)


  function updateOption(option: keyof ExtensionOptions, value: number| boolean) {
    setOptions((options: ExtensionOptions) => {
      const newOptions:any = {...options} // oopsie
      newOptions[option] = value
      return newOptions
    })
  }

  return (
    <div className='options-page'>
      <div className='header'>
        <img src={logoImage} />
        <div>ChatGPT ScrollMap</div>
      </div>
      <div className="options-container">
        <CheckboxInput
          label='Keep open'
          checkedInitially={options["keepOpen"]}
          onChange={(value:boolean) => updateOption("keepOpen", value)} />
        <CheckboxInput
          label='Enable smooth scrolling'
          checkedInitially={options["enableSmoothScrolling"]}
          onChange={(value:boolean) => updateOption("keepOpen", value)} />
        <CheckboxInput
          label='Enable auto refresh'
          checkedInitially={options["enableAutoRefresh"]}
          onChange={(value:boolean) => updateOption("enableAutoRefresh", value)} />
        {
          options["enableAutoRefresh"] ?
          <RangeInput
            label='Refresh period'
            initialValue={options["refreshPeriod"]}
            onChange={(value: number) => updateOption("refreshPeriod", value)} 
            range={[0, 10]}/> : null
        }
        
      </div>
    </div>
  )
}

export default OptionsPage;
