import './App.css'
import demoImage from '../../assets/demo.png'

const logoImage = chrome.runtime.getURL("assets/logo.png")

function App() {
  return (
    <div>
    <div id="heading">
      <img src={logoImage} />
      <h2>ChatGPT ScrollMap</h2>
    </div>
   
    <p>
      This extension only works for
      <a href="https://www.chatgpt.com" target="_blank">chatgpt.com</a>
    </p>
    <p>There should be a minimap button in the top right of chatgpt.</p>
    <img id="demo" src={demoImage} />
    <ul>
      <li>Refresh page if button has not appeared</li>
      <li>Click refresh button if chat contents do not match</li>
    </ul>

    <p>
      Open source chrome extension, contributions
      are more than welcome on:
    </p>
    <div id="links">
      <a
        href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt"
        target="_blank">
        Github</a>
      <a href="https://aebel-shajan.github.io/" target="_blank">
          Made by Aebel</a>
      <a
        href="https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf"
        target="_blank">
        Store page</a>
      <a
        href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt/issues"
        target="_blank">
        Report an issue / feature</a>
    </div>
    </div>
  )
}

export default App
