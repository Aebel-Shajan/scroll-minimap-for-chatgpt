import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../ContentContainer";
import styles from "./ViewOverlay.module.css"

interface ViewOverLayProps {
  scale: number;
  handleDrag: CallableFunction;
}

const ViewOverlay = ({
  scale,
  handleDrag
}: ViewOverLayProps) => {
  // Context
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("OptionsContainer should be used within content context")
  }
  const {currentScrollContainer} = context;
  
  // States & Refs
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseY, setMouseY] = useState<number>(0)

  function onScroll(scrollContainer: HTMLElement, scale: number) {
    setScrollTop(scrollContainer.scrollTop * scale);
    setHeight(scrollContainer.offsetHeight * scale);
  }

  // on initial render
  useEffect(() => {
    function updateMouseDown() {
      setMouseDown(false)
      document.body.style.cursor = "unset"
    }
    function updateMouseY(e: MouseEvent) {setMouseY(e.clientY)}
    window.addEventListener("mouseup", updateMouseDown)
    window.addEventListener("mousemove", updateMouseY)
    return () => {
      window.removeEventListener("mouseup", updateMouseDown)
      window.removeEventListener("mousemove", updateMouseY)
    }
  }, [])

  useEffect(() => {
    if (mouseDown) {
      handleDrag(mouseY)
      document.body.style.cursor = "grabbing"
    }
  }, [mouseDown, handleDrag, mouseY])

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

  return <div 
    className={styles.viewOverlay} 
    style={overrideStyle}
    onMouseDown={() => setMouseDown(true)}
    ></div>;
};

export default ViewOverlay;