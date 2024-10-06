import React, { useEffect, useRef, useState } from "react";
import ViewOverlay from "./ViewOverlay/ViewOverlay";
import CanvasContainer from "./CanvasContainer/CanvasContainer";

interface MinimapProps {
  refreshMinimap: boolean;
  chatContainer: HTMLElement|null;
  scrollContainer: HTMLElement|null;
}
const MinimapContainer = ({ refreshMinimap, chatContainer, scrollContainer }: MinimapProps) => {
  const [scale, setScale] = useState<number>(0);
  const minimapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("scale updated")
  }, [scale])

  useEffect(() => {
    const minimapContainer = minimapContainerRef.current;
    if (!scrollContainer) return;
    if (!minimapContainer) return;
    function onDrag(mousePos: number) {
      const minimapContainer = minimapContainerRef.current;
      if (!scrollContainer) return;
      if (!minimapContainer) return;

      const relativeMousePos =
        mousePos - minimapContainer.getBoundingClientRect().top;
      const newScrollPos =
        (relativeMousePos + minimapContainer.scrollTop) / scale;
      scrollContainer.scrollTo(0, newScrollPos);
    }

    minimapContainer.addEventListener("click", (e) => onDrag(e.clientY));

    function onScroll() {
      console.log("scrolling")
      const minimapContainer = minimapContainerRef.current;
      if (!scrollContainer) return;
      if (!minimapContainer) return;
      const ratio =
        scrollContainer.scrollTop /
        (scrollContainer.scrollHeight + scrollContainer.offsetHeight);

      minimapContainer.scrollTop =
        scale * scrollContainer.scrollTop -
        ratio * minimapContainer.offsetHeight;
    }
    scrollContainer.addEventListener("scroll", () => onScroll());
  }, [refreshMinimap, scale, scrollContainer]);

  return (
    <div
      className="minimap-container"
      style={minimapContainerStyle}
      ref={minimapContainerRef}
    >
      <CanvasContainer refreshCanvas={refreshMinimap} chatContainer={chatContainer} setScale={setScale} />
      <ViewOverlay refreshCanvas={refreshMinimap} scrollContainer={scrollContainer} scale={scale} />
    </div>
  );
};

const minimapContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "80px",
  height: "90vh",
  backgroundColor: "green",
  pointerEvents: "all",
  boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
  overflowY: "scroll",
  scrollbarWidth: "none",
};


export default MinimapContainer;

