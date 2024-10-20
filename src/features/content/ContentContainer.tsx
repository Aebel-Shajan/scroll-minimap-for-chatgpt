import { useEffect, useRef, useState } from "react";
import OptionsContainer from "./components/OptionsContainer";
import Minimap from "./components/MinimapContainer/MinimapContainer";
import {
  queryAllChatElements,
  queryChatContainer,
  queryNavElement,
} from "./utils/renderLogic";
import { ExtensionOptions } from "../../types/options";
import { DEFAULT_OPTIONS } from "../../constants";

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

  // On initial render
  useEffect(() => {
    addLocationObserver(() => {
      // console.log("document body changed");
      setTimeout(() => {
        const newChat = queryChatContainer();
        if (chatContainer.current !== newChat) {
          // console.log("chat container changed");
          triggerCanvasRefresh();
        }
        chatContainer.current = newChat;
        if (newChat) {
          scrollContainer.current = newChat.parentElement;
        }
      }, 500); // delayed because it takes some time for chats  to load
    });

    chrome.storage.sync.get(['options'], function(data) {
      if (data.options) {
        const options: ExtensionOptions = {...data.options}
        setOptions(options)
        setShowMinimap(options.keepOpen)
        console.log(options)
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
        onNextChat={() => onNextChat(scrollContainer.current, options.smoothScrolling)}
        onPreviousChat={() => onPreviousChat(scrollContainer.current, options.smoothScrolling)}
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
function addLocationObserver(callback: MutationCallback) {
  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: false };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);
}

const onNextChat = (scrollContainer: HTMLElement | null, smoothScroll: boolean) => {
  // Calculate scroll pos of closest next chat
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
const onPreviousChat = (scrollContainer: HTMLElement | null, smoothScroll: boolean) => {
  // Calculate scroll pos of closest previous chat
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
