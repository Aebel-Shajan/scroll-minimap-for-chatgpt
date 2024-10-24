import { BiDownArrow, BiRefresh, BiUpArrow } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
// import { ExtensionOptions } from "../../../../types/options";
import { IoSettingsOutline } from "react-icons/io5";
import { useContext} from "react";
import { ContentContext } from "../ContentContainer";
import { onNextChat, onPreviousChat, queryNextElement, queryPreviousElement } from "../../utils/renderLogic";
import styles from "./ButtonContainer.module.css"
import { Tooltip, TooltipProps } from "@mantine/core";


const logo = chrome.runtime.getURL("assets/logo.png");

interface CustomTooltipProps extends TooltipProps {
  label: string,
  children: React.ReactNode
}

const CustomTooltip = ({ label, children, ...props }: CustomTooltipProps) => {
  return (
    <Tooltip
      label={label}
      position="left"
      color={"teal"}   // Default color for the tooltip
      w={150}
      styles={{
        tooltip: {fontSize: 12}
      }}
      multiline
      withArrow     // Add an arrow to the tooltip
      {...props}         // Spread any additional props passed
    >
      {children}
    </Tooltip>
  );
};

export default function ButtonContainer() {
  // Context
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("OptionsContainer should be used within content context")
  }
  const { showMinimap, setShowMinimap, searchForChat, options } = context;

  // Variables
  const nextPreview = getChatPreviewFormat(queryNextElement()) // don't have to store in state because parent updates on scroll 
  const previousPreview = getChatPreviewFormat(queryPreviousElement()) // is it bad practice?


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

            <CustomTooltip
              label={options.autoRefresh? `Auto refreshes every ${options.refreshPeriod} seconds`:"Refresh minimap"}
            >
              <button
                onClick={() => searchForChat()}
                style={options.autoRefresh ? {color: "#AAFF00"}: {}}
                >
                <BiRefresh />
              </button>
            </CustomTooltip>
            
          </div>
          <div>
            
            <CustomTooltip 
              label={previousPreview.previewText}
              color={previousPreview.previewColor}
            >
              <button onClick={() => onPreviousChat(options.smoothScrolling)} >
                <BiUpArrow />
              </button>
            </CustomTooltip>

            <CustomTooltip
              position="left"
              label={nextPreview.previewText}
              color={nextPreview.previewColor}
              >
              <button onClick={() => onNextChat(options.smoothScrolling)}>
                <BiDownArrow />
              </button>
            </CustomTooltip>

          </div>
        </>
      ) : null}
    </div>
  );
}

interface PreviewFormat {
  previewText: string, 
  previewColor: string
}

function getChatPreviewFormat(chat: HTMLElement|null): PreviewFormat {
  if (!chat) return {
    previewText: "end",
    previewColor: "grey"
  }
  const trimmedChat = chat.querySelector("[data-message-id]") as HTMLElement
  const author:string|null = trimmedChat.getAttribute("data-message-author-role")
  if (!trimmedChat) return {
    previewText: "error getting next element",
    previewColor: "red"
  }
  return {
    previewText: trimmedChat.innerText.replace(/\n/g, '').slice(0, 60) + "...",
    previewColor: author === "user" ? "teal" : "#2E2E2E" // mantine color
  }
}

function onOpenOptions() {
  chrome.runtime.sendMessage({ "action": "openOptionsPage" });
}