import { useContext, useEffect, useRef, useState } from "react";
import ViewOverlay from "./ViewOverlay/ViewOverlay";
import CanvasContainer from "./CanvasContainer/CanvasContainer";
import { ContentContext } from "../ContentContainer";
import styles from "./MinimapContainer.module.css";
import { Box, Loader, LoadingOverlay } from "@mantine/core";


const MinimapContainer = () => {
  // Context
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("OptionsContainer should be used within content context")
  }
  const {currentChatText, currentChatContainer, currentScrollContainer, currentScrollPos} = context;
  
  // States & refs
  const [scale, setScale] = useState<number>(0);
  const minimapContainerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [overlayText, setOverlayText] = useState<string>("loading")

  // Functions
  function handleDrag(
    mouseY: number
  ) {
    const minimapContainer = minimapContainerRef.current
    if (!minimapContainer || !currentScrollContainer) return 
    const relativeMousePos =
      mouseY - minimapContainer.getBoundingClientRect().top;
    const newScrollPos =
      (relativeMousePos + minimapContainer.scrollTop) / scale -
      0.5 * currentScrollContainer.offsetHeight;
    currentScrollContainer.scrollTo(0, newScrollPos);
  }

  useEffect(() => {
    const minimapContainer = minimapContainerRef.current
    if (!minimapContainer || !currentScrollContainer) return 
    setMinimapContainerScroll(minimapContainer, currentScrollContainer, scale)
  }, [currentScrollPos, currentScrollContainer, scale])

  return (
    <Box pos="relative">
    <div
      className={styles.minimapContainer}
      ref={minimapContainerRef}
    >
      <CanvasContainer
        chatText={currentChatText}
        chatContainer={currentChatContainer}
        setScale={setScale}
        setShowOverlay={setShowOverlay}
        setOverlayText={setOverlayText}
      />
      <ViewOverlay scale={scale} handleDrag={handleDrag}/>      
    </div>
      <LoadingOverlay
        classNames={{
          root: styles.loadingOverlay,
          loader: styles.loader,
        }}
        visible={showOverlay} 
        zIndex={1000} 
        loaderProps={{children: overlayText ==="loading" ? <Loader color="white" /> : overlayText}}
        overlayProps={{color: "#000", backgroundOpacity: 0.1, blur: 5}}
        
        />
    </Box>
  );
};


export default MinimapContainer;


function setMinimapContainerScroll(
  minimapContainer: HTMLElement,
  scrollContainer: HTMLElement,
  scale: number
) {
  const scrollPercentage = scrollContainer.scrollTop / scrollContainer.scrollHeight
  const viewScrollTop = scrollPercentage * minimapContainer.scrollHeight 
  const adjustedMinimapHeight = minimapContainer.offsetHeight - (scale * scrollContainer.offsetHeight) 
  minimapContainer.scrollTop = viewScrollTop- (adjustedMinimapHeight * scrollPercentage)
}
