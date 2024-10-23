import { memo, useEffect, useRef } from "react";
import { generateMinimapCanvas } from "../../../utils/renderLogic";
import styles from "./CanvasContainer.module.css"

interface CanvasContainerProps {
  setScale: CallableFunction;
  chatContainer: HTMLElement | null;
  chatText: string,
  setShowOverlay: CallableFunction;
  setOverlayText: CallableFunction;
}

const CanvasContainer = ({
  setScale,
  chatContainer,
  chatText,
  setShowOverlay,
  setOverlayText
}: CanvasContainerProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(()=> console.log("canvas container rerendered", isLoading.current, chatContainer===null))

  // On chat container change, on chat text change
  useEffect(() => {
    (async () => {
      const canvasContainer = canvasContainerRef.current;
      if (!canvasContainer) return;
      // if (canvasContainer.parentElement){ // scroll to top to display message
      //   canvasContainer.parentElement.scrollTo(0, 0)
      // }
      setShowOverlay(true)
      if (!chatContainer) {
        setOverlayText("No chat detected, try refreshing the minimap")
        return
      }
      setOverlayText("Loading...")
      // console.log("generating minmiap canvas...")
      const canvas = await generateMinimapCanvas(chatContainer);
      setShowOverlay(false)
      canvasContainer.innerHTML = "";
      canvasContainer.appendChild(canvas);

      const scale = canvasContainer.offsetWidth / canvas.offsetWidth;
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale * canvas.offsetHeight}px`;
      setScale(canvas.offsetHeight / chatContainer.offsetHeight);
    })();
  }, [chatContainer, chatText]);

  return (
    <div className={styles.canvasContainer}ref={canvasContainerRef}></div>
  );
};

export default memo(CanvasContainer);
