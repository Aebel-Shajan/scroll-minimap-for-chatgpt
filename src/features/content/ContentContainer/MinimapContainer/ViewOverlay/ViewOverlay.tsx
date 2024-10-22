import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../ContentContainer";

interface ViewOverLayProps {
  scale: number;
}

const ViewOverlay = ({
  scale
}: ViewOverLayProps) => {
    // Context
    const context = useContext(ContentContext);
    if (!context) {
      throw new Error("OptionsContainer should be used within content context")
    }
    const {currentScrollContainer} = context;
  
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  function onScroll(scrollContainer: HTMLElement, scale: number) {
    setScrollTop(scrollContainer.scrollTop * scale);
    setHeight(scrollContainer.offsetHeight * scale);
  }

  useEffect(() => {
    if (!currentScrollContainer) return;
    onScroll(currentScrollContainer, scale);
    currentScrollContainer.addEventListener("scroll", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      onScroll(event.target, scale);
    });
  }, [scale, currentScrollContainer]);

  const currentViewStyle: React.CSSProperties = {
    position: "absolute",
    top: `${scrollTop}px`,
    left: "0",
    width: "100%",
    height: `${height}px`,
    backgroundColor: `#00FFD744`,
    cursor: "grab",
  };
  return <div className="current-view" style={currentViewStyle}></div>;
};

export default ViewOverlay;
