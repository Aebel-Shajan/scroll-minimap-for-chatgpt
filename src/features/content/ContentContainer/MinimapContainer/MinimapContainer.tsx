import { useContext, useEffect, useRef, useState } from "react";
import ViewOverlay from "./ViewOverlay/ViewOverlay";
import CanvasContainer from "./CanvasContainer/CanvasContainer";
import { ContentContext } from "../ContentContainer";
import styles from "./MinimapContainer.module.css";
import { Box, LoadingOverlay } from "@mantine/core";


const MinimapContainer = () => {
    // Context
    const context = useContext(ContentContext);
    if (!context) {
      throw new Error("OptionsContainer should be used within content context")
    }
    const {currentChatText, currentChatContainer, currentScrollContainer} = context;
  
  const [scale, setScale] = useState<number>(0);
  const mouseDown = useRef<boolean>(false);
  const [dragPos, setDragPos] = useState<number>(0);
  const minimapContainerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [overlayText, setOverlayText] = useState<string>("Loadding...")

  useEffect(() => {
    const minimapContainer = minimapContainerRef.current;
    if (!minimapContainer) return;
    // console.log("event listeners added.");
    window.addEventListener("mouseup", () => {
      mouseDown.current = false;
    });
    minimapContainer.addEventListener("mousedown", () => {
      mouseDown.current = true;
    });
    minimapContainer.addEventListener("mousemove", (e) => {
      if (mouseDown.current) {
        setDragPos(e.clientY);
      }
    });
  }, [setDragPos]);

  useEffect(() => {
    const minimapContainer = minimapContainerRef.current;
    if (!minimapContainer) return;
    if (!currentScrollContainer) return;
    onDrag(minimapContainer, currentScrollContainer, scale, dragPos);
  }, [dragPos]);

  useEffect(() => {
    const minimapContainer = minimapContainerRef.current;
    if (!currentScrollContainer) return;
    if (!minimapContainer) return;
    setMinimapContainerScroll(minimapContainer, currentScrollContainer, scale)
    currentScrollContainer.addEventListener("scroll", () =>
      setMinimapContainerScroll(minimapContainer, currentScrollContainer, scale)
    );
  }, [currentScrollContainer, scale]);

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
      <ViewOverlay scale={scale}/>      
    </div>
      <LoadingOverlay
        visible={showOverlay} 
        zIndex={1000} 
        loaderProps={{children: overlayText}} />
    </Box>
  );
};


export default MinimapContainer;

function onDrag(
  minimapContainer: HTMLElement,
  scrollContainer: HTMLElement,
  scale: number,
  mousePos: number
) {
  const relativeMousePos =
    mousePos - minimapContainer.getBoundingClientRect().top;
  const newScrollPos =
    (relativeMousePos + minimapContainer.scrollTop) / scale -
    0.5 * scrollContainer.offsetHeight;

  scrollContainer.scrollTo(0, newScrollPos);
}

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
