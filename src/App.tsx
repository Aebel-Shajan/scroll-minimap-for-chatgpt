import { useState } from 'react'
import OptionsContainer from './components/OptionsContainer'
import Minimap from './components/Minimap'


function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false)

  return (
    <div className='app-container' style={appContainerStyle}>
    <OptionsContainer 
      showMinimap={showMinimap}
      setShowMinimap={setShowMinimap} 
    />
    {showMinimap ? <Minimap />: null}
    </div>
  )
}

const appContainerStyle: React.CSSProperties = {
  display: 'flex',
  height: '100%',
  width: "100%",
  overflow: "hidden",
  justifyContent: "right"
}

export default App
