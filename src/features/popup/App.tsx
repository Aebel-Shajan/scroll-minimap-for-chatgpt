import styles from './App.module.css'
import demoImage from '../../assets/demo.png'
import logoImage from '../../assets/logo.png'
import { FaGithub, FaStar } from 'react-icons/fa'
import { MdBugReport } from 'react-icons/md'
import { GoGear } from 'react-icons/go'
import { Tooltip } from '@mantine/core'


function App() {
  return (
    <div>
    <div className={styles.heading}>
      <img src={logoImage} />
      <h1>ChatGPT ScrollMap</h1>
    </div>

    <div className={styles.body}>
   
      <div>
        This extension only works for <a
          href="https://www.chatgpt.com" 
          target="_blank"
          >
            chatgpt.com
          </a>
      </div>

      <div className={styles.demo}>
        <p>There should be a minimap button in the top right of chatgpt.</p>
        <img id="demo" src={demoImage} />
      </div>

      <div>
        Trouble shooting:
        <ul>
          <li>Refresh page if button has not appeared</li>
          <li>Click refresh button if chat contents do not match</li>
        </ul>
      </div>

      </div>

      <div className={styles.footer}>
        <Tooltip label="Give the github repo a star 🤩">
        <a 
          href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt"
          target="_blank">
          <FaGithub />
        </a>
        </Tooltip>
        <Tooltip label="Options">
          <a
            onClick={handleOpenOptions}
            >
              <GoGear />
          </a>
        </Tooltip>
        <Tooltip label="Leave a review">
          <a
            href="https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf"
            target="_blank">
            <FaStar />
          </a>
        </Tooltip>
        <Tooltip label="Report a bug">
          <a
            href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt/issues"
            target="_blank">
              <MdBugReport />
          </a>
        </Tooltip>
        <Tooltip label="Request the next feature 🧪">
          <a
            href='https://buymeacoffee.com/aebel'
            target='_blank'
          >
            🧪
          </a>
        </Tooltip>
      </div>
    </div>
  )
}


function handleOpenOptions() {
  chrome.runtime.sendMessage({ "action": "openOptionsPage" });
}

export default App
