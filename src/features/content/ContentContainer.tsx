import { useEffect, useRef, useState } from "react";
import OptionsContainer from "./components/OptionsContainer";
import Minimap from "./components/MinimapContainer/MinimapContainer";
import {
  queryAllChatElements,
  queryChatContainer,
  queryChatScrollContainer,
  queryNavElement,
} from "./utils/renderLogic";
import { ExtensionOptions } from "../../types/options";
import { DEFAULT_OPTIONS } from "../../constants";

// let lastChatText: string = ""
let lastUrl: string = ""

export default function ContentContainer() {
  // States
  const [options, setOptions] = useState<ExtensionOptions>(DEFAULT_OPTIONS)
  const [showMinimap, setShowMinimap] = useState<boolean>(DEFAULT_OPTIONS.keepOpen);
  const [manualRefresh, setManualRefresh] = useState<boolean>(false);
  const chatContainer = useRef<HTMLElement | null>(null);
  const scrollContainer = useRef<HTMLElement | null>(null);

  function triggerCanvasRefresh() {
    // changing state always triggers a refresh of parent and child states (excluding memo compnents)
    // console.log("manual refresh triggered")
    setManualRefresh((temp) => !temp);
    chatContainer.current = queryChatContainer()
    if (chatContainer.current) {
      scrollContainer.current = chatContainer.current.parentElement;
    }
  }

  // function refreshOnChatChange() {
  //   const chatContainer = queryChatContainer()
  //   if (!chatContainer) return 
  //   const currentChatText = chatContainer.innerText
  //   if (currentChatText !== lastChatText) {
  //     lastChatText = currentChatText
  //     triggerCanvasRefresh();
  //   }
  // }

  function refreshOnAddressChange() {
    const currentUrl = location.href;
    console.log("document changed")
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl
        triggerCanvasRefresh()
      }
    }

  // On initial render
  useEffect(() => {
    // Detect all changes in dom -> is it a url change? -> if so refresh the minimap
    executeOnElementChange(refreshOnAddressChange, document)
    
    chrome.storage.sync.get(['options'], function(data) {
      if (data.options) {
        const options: ExtensionOptions = {...data.options}
        setOptions(options)
        setShowMinimap(options.keepOpen)
      }

    })
  }, []);

  // Helper functions
  const onToggleMinimap = () => {
    setShowMinimap(!showMinimap);
    triggerCanvasRefresh();
  };
  const onRefreshMinimap = () => {
    triggerCanvasRefresh();
  };

  return (
    <div className="app-container" style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={onToggleMinimap}
        onRefreshMinimap={onRefreshMinimap}
        onNextChat={() => onNextChat( options.smoothScrolling)}
        onPreviousChat={() => onPreviousChat(options.smoothScrolling)}
        showMinimap={showMinimap}
      />
      {showMinimap ? (
        <Minimap
          refreshMinimap={manualRefresh}
          chatContainer={chatContainer.current}
          scrollContainer={scrollContainer.current}
        />
      ) : null}
    </div>
  );
}

const appContainerStyle: React.CSSProperties = {
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  justifyContent: "right",
  pointerEvents: "none",
  userSelect: "none",
};
/**
 * Observes changes to the child elements of a specified DOM element and executes a 
 * callback function when mutations are detected.
 *
 * @param callback - The function to be executed when mutations are observed. 
 *  It receives a list of MutationRecord objects and the MutationObserver instance as 
 *  arguments.
 * @param element - The DOM element to be observed for changes.
 */
function executeOnElementChange(callback: MutationCallback, element: HTMLElement|Document) {
  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(element, config);
}

const onNextChat = (smoothScroll: boolean) => {
  // Calculate scroll pos of closest next chat
  const scrollContainer = queryChatScrollContainer();
  const navElement = queryNavElement();
  if (!scrollContainer || !navElement) return;
  const navHeight = navElement.offsetHeight;
  const chatElements = queryAllChatElements();
  const nextChats = chatElements.filter((element) => {
    return element.getBoundingClientRect().top > 1.1 * navHeight;
  });
  if (nextChats.length === 0) return;
  const closestNextChat = nextChats[0];
  const scrollPos = scrollContainer.scrollTop +
  closestNextChat.getBoundingClientRect().top -
  navHeight

  // Configure scroll options
  const scrollOptions: ScrollToOptions= {
    top: scrollPos,
    behavior: "instant"
  }
  if (smoothScroll) {
    scrollOptions["behavior"] = "smooth"
  }

  // Scroll scrollContainer
  scrollContainer.scrollTo(scrollOptions);
};
const onPreviousChat = (smoothScroll: boolean) => {
  // Calculate scroll pos of closest previous chat
  const scrollContainer = queryChatScrollContainer();
  const navElement = queryNavElement();
  if (!scrollContainer || !navElement) return;
  const navHeight = navElement.offsetHeight;
  const chatElements = queryAllChatElements();
  const nextChats = chatElements.filter((element) => {
    return element.getBoundingClientRect().top < navHeight;
  });
  if (nextChats.length === 0) return;
  const firstNextChat = nextChats[nextChats.length - 1];
  const scrollPos = scrollContainer.scrollTop +
  firstNextChat.getBoundingClientRect().top -
  navHeight

  // Configure scroll options
  const scrollOptions: ScrollToOptions = {
    top: scrollPos,
    behavior: "instant"
  }
  if (smoothScroll) {
    scrollOptions["behavior"] = "smooth"
  }

  // Scroll container
  scrollContainer.scrollTo(scrollOptions);
};
