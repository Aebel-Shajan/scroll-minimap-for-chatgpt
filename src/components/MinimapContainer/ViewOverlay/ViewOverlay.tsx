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

  function onScroll(scrollContainer: HTMLElement, scale: number) {
    setScrollTop(scrollContainer.scrollTop * scale);
    setHeight(scrollContainer.offsetHeight * scale);
  }

  useEffect(() => {
    if (!chatContainer) return;
    const scrollContainer = chatContainer.parentElement;
    if (!scrollContainer || !scale.current) return; 
    onScroll(scrollContainer, scale.current)
    scrollContainer.addEventListener("scroll", (event) => {
      if (!(event.target instanceof HTMLElement)) return
      if (!scale.current) return 
      onScroll(event.target, scale.current)
  });
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


