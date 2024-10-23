import { BiDownArrow, BiRefresh, BiUpArrow } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
// import { ExtensionOptions } from "../../../../types/options";
import { IoSettingsOutline } from "react-icons/io5";
import { useContext } from "react";
import { ContentContext } from "../ContentContainer";
import { onNextChat, onPreviousChat } from "../../utils/renderLogic";
import styles from "./ButtonContainer.module.css"
import { Tooltip } from "@mantine/core";


const logo = chrome.runtime.getURL("assets/logo.png");


export default function ButtonContainer() {
  // Context
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("OptionsContainer should be used within content context")
  }
  const { showMinimap, setShowMinimap, searchForChat, options } = context;

  function onOpenOptions() {
    chrome.runtime.sendMessage({ "action": "openOptionsPage" });
  }

  return (
    <div className={styles.buttonContainer} >
        <button onClick={() => setShowMinimap((last: boolean) => !last)} >
          {showMinimap ? <CgClose /> : <img src={logo} />}
        </button>
      {showMinimap ? (
        <>
          <div>
            <button onClick={() => onOpenOptions()} >
              <IoSettingsOutline />
            </button>
            <Tooltip
              position="left"
              label={options.autoRefresh? `Auto refreshes every ${options.refreshPeriod} seconds`:"Refresh minimap"}
              color="teal"
              openDelay={200}
              w={150}
              multiline
              withArrow
            >
            <button
              onClick={() => searchForChat()}
              style={options.autoRefresh ? {color: "#AAFF00"}: {}}
              >
              <BiRefresh />
            </button>
            </Tooltip>
          </div>
          <div>
            <button onClick={() => onPreviousChat(options.smoothScrolling)} >
              <BiUpArrow />
            </button>
            <button onClick={() => onNextChat(options.smoothScrolling)}>
              <BiDownArrow />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

