import React, { useContext, useEffect, useRef, useState } from "react";
import ViewOverlay from "./ViewOverlay/ViewOverlay";
import CanvasContainer from "./CanvasContainer/CanvasContainer";
import { ContentContext } from "../ContentContainer";


const MinimapContainer = () => {
    // Context
    const context = useContext(ContentContext);
    if (!context) {
      throw new Error("OptionsContainer should be used within content context")
    }
    const {currentChatContainer, currentScrollContainer} = context;
  
  const [scale, setScale] = useState<number>(0);
  const mouseDown = useRef<boolean>(false);
  const [dragPos, setDragPos] = useState<number>(0);
  const minimapContainerRef = useRef<HTMLDivElement>(null);

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
  }, [dragPos, currentScrollContainer, scale]);

  useEffect(() => {
    const minimapContainer = minimapContainerRef.current;
    if (!currentScrollContainer) return;
    if (!minimapContainer) return;
    currentScrollContainer.addEventListener("scroll", () =>
      onScroll(minimapContainer, currentScrollContainer, scale)
    );
  }, [currentScrollContainer, scale, currentScrollContainer]);

  return (
    <div
      className="minimap-container"
      style={minimapContainerStyle}
      ref={minimapContainerRef}
    >
      <CanvasContainer
        chatContainer={currentChatContainer}
        setScale={setScale}
      />
      <ViewOverlay scale={scale}/>
    </div>
  );
};

const minimapContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "80px",
  height: "90vh",
  backgroundColor: "#343442",
  pointerEvents: "all",
  boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
  overflowY: "scroll",
  scrollbarWidth: "none",
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

function onScroll(
  minimapContainer: HTMLElement,
  scrollContainer: HTMLElement,
  scale: number
) {
  const ratio =
    scrollContainer.scrollTop /
    (scrollContainer.scrollHeight + scrollContainer.offsetHeight);

  minimapContainer.scrollTop =
    scale * scrollContainer.scrollTop - ratio * minimapContainer.offsetHeight;
}