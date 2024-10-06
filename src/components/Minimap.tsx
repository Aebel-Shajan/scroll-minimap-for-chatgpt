import React, { useEffect, useRef, useState } from "react";
import {
  generateMinimapCanvas,
  queryChatContainer,
  queryChatScrollContainer,
} from "../utils/renderLogic";
import ViewOverlay from "./MinimapContainer/ViewOverlay/ViewOverlay";

interface MinimapProps {
  refreshMinimap: boolean
}
const Minimap = ({ refreshMinimap }: MinimapProps) => {
  const [scale, setScale] = useState<number>(0);
  const minimapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("scale updated")
  }, [scale])

  useEffect(() => {
    const scrollContainer = queryChatScrollContainer();
    const minimapContainer = minimapContainerRef.current;
    if (!scrollContainer) return;
    if (!minimapContainer) return;
    function onDrag(mousePos: number) {
      const scrollContainer = queryChatScrollContainer();
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
      const scrollContainer = queryChatScrollContainer();
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
  }, [refreshMinimap, scale]);

  return (
    <div
      className="minimap-container"
      style={minimapContainerStyle}
      ref={minimapContainerRef}
    >
      <CanvasContainer refreshCanvas={refreshMinimap} setScale={setScale} />
      <ViewOverlay refreshCanvas={refreshMinimap} scale={scale} />
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

const canvasContainerStyle: React.CSSProperties = {
  width: "100%",
};

export default Minimap;

interface CanvasContainerProps {
  refreshCanvas: boolean;
  setScale: CallableFunction;
}

const CanvasContainer = React.memo(
  ({ refreshCanvas, setScale }: CanvasContainerProps) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      console.log("canvase rerendered");
      (async () => {
        const chatContainer = queryChatContainer();
        const canvasContainer = canvasContainerRef.current;
        if (!chatContainer || !canvasContainer) return;
        const canvas = await generateMinimapCanvas(chatContainer);
        canvasContainer.innerHTML = "";
        canvasContainer.appendChild(canvas);

        const scale = canvasContainer.offsetWidth / canvas.offsetWidth;
        setScale(scale);
        canvas.style.width = `${canvasContainer.offsetWidth}px`;
        canvas.style.height = `${scale * canvas.offsetHeight}px`;
      })();
    }, [refreshCanvas, setScale]);

    return (
      <div
        className="canvas-container"
        style={canvasContainerStyle}
        ref={canvasContainerRef}
      ></div>
    );
  }
);
