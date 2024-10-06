import { useEffect, useState } from "react";
import { queryChatScrollContainer } from "../../../utils/renderLogic";

interface ViewOverLayProps {
  refreshCanvas: boolean;
  scale: number;
}

export default function ViewOverlay({
  refreshCanvas,
  scale,
}: ViewOverLayProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  function onScroll(scrollContainer: HTMLElement, scale: number) {
    setScrollTop(scrollContainer.scrollTop * scale);
    setHeight(scrollContainer.offsetHeight * scale);
  }

  useEffect(() => {
    const scrollContainer = queryChatScrollContainer();
    if (!scrollContainer) return; 
    onScroll(scrollContainer, scale)
    scrollContainer.addEventListener("scroll", (event) => {
      if (!(event.target instanceof HTMLElement)) return
      onScroll(event.target, scale)
  });
  },[scale, refreshCanvas]);

  const currentViewStyle: React.CSSProperties = {
    position: "absolute",
    // top: `${scale * scrollContainer.scrollTop}px`,
    top: `${scrollTop}px`,
    left: "0",
    width: "100%",
    height: `${height}px`,
    backgroundColor: `#00aadd99`
  };
  return <div className="current-view" style={currentViewStyle}></div>;
}


