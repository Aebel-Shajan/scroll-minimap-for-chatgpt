import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../ContentContainer";
import styles from "./ViewOverlay.module.css"

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

  const overrideStyle: React.CSSProperties = {
    top: `${scrollTop}px`,
    height: `${height}px`
  }

  return <div className={styles.viewOverlay} style={overrideStyle}></div>;
};

export default ViewOverlay;
