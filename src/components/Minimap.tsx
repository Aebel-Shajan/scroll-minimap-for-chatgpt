import { useEffect, useRef } from "react";
import { generateMinimapCanvas } from "../utils/renderLogic";
import ViewOverlay from "./MinimapContainer/ViewOverlay/ViewOverlay";

interface MinimapProps {
  chatContainer: HTMLElement | null
}
const Minimap = ({chatContainer}: MinimapProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const scale = useRef<number>(0);
  const minimapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(()=> {
    if (!chatContainer) return;
    const scrollContainer = chatContainer.parentElement;
    const minimapContainer = minimapContainerRef.current
    if (!scrollContainer) return;
    if (!minimapContainer) return
    function onDrag(mousePos: number) {
      if (!chatContainer) return;
      const scrollContainer = chatContainer.parentElement;
      const minimapContainer = minimapContainerRef.current
      if (!scrollContainer) return;
      if (!minimapContainer) return
      
      const relativeMousePos = mousePos - minimapContainer.getBoundingClientRect().top;
      const newScrollPos = (relativeMousePos + minimapContainer.scrollTop) / scale.current 
      scrollContainer.scrollTo(0, newScrollPos)
    }

    minimapContainer.addEventListener("click", (e)=>onDrag(e.clientY))

    function onScroll() {
      if (!chatContainer) return;
      const scrollContainer = chatContainer.parentElement;
      const minimapContainer = minimapContainerRef.current
      if (!scrollContainer) return;
      if (!minimapContainer) return
      const ratio = (scrollContainer.scrollTop / (scrollContainer.scrollHeight + scrollContainer.offsetHeight))
      
      minimapContainer.scrollTop = (scale.current * scrollContainer.scrollTop ) - (ratio * minimapContainer.offsetHeight) 
    }
    scrollContainer.addEventListener("scroll", () => onScroll())
    
  }, [chatContainer])

  useEffect(() => {
    console.log("minimap rerendered");
    (async () => {
      const canvasContainer = canvasContainerRef.current
      if (!chatContainer || !canvasContainer) return
      const canvas = await generateMinimapCanvas(chatContainer)
      canvasContainer.innerHTML = ""
      canvasContainer.appendChild(canvas);
    
      scale.current = canvasContainer.offsetWidth / canvas.offsetWidth;
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale.current * canvas.offsetHeight}px`;
    })()
  })
  

  return (
    <div className="minimap-container" style={minimapContainerStyle} ref={minimapContainerRef}>
      <div
        className="canvas-container"
        style={canvasContainerStyle}
        ref={canvasContainerRef}
      >
      </div>
      <ViewOverlay chatContainer={chatContainer} scale={scale} />
    </div>
  );
};

const minimapContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "5rem",
  height: "90vh",
  backgroundColor: "green",
  pointerEvents: "all",
  boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
  overflowY: "scroll",
  scrollbarWidth: "none"
};

const canvasContainerStyle: React.CSSProperties = {
  width: "100%",
}


export default Minimap;
