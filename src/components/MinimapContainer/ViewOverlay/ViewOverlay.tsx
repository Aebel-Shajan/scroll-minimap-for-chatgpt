import { useEffect, useState } from "react";

interface ViewOverLayProps {
  chatContainer: HTMLElement | null;
  scale: React.RefObject<number>;
}

export default function ViewOverlay({
  chatContainer,
  scale,
}: ViewOverLayProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    console.log("view overlay rendered")
    console.log(height, scrollTop, scale) 
  });

  useEffect(() => {
    if (!chatContainer) return;
    const scrollContainer = chatContainer.parentElement;
    if (!scrollContainer) return;
    
    function onScroll() {
      if (!chatContainer) return;
      const scrollContainer = chatContainer.parentElement;
      if (!scrollContainer || !scale.current) return;
      setScrollTop(scrollContainer.scrollTop * scale.current);
      setHeight(scrollContainer.offsetHeight * scale.current);
      console.log("oooo")
    }
    onScroll()
    scrollContainer.addEventListener("scroll", () => onScroll());
  }, [chatContainer, scale]);

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
