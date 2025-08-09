import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";
import MinimapCanvas from "./MinimapCanvas";
import { createChildObserver, createSizeObserver, onNextChat, onPreviousChat } from "./utils";

/**
 * Minimap component that provides a visual representation of a larger element's scrollable area.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.elementSelector - The selector of the HTML element to map to the minimap.
 * 
 * @returns {JSX.Element} The rendered Minimap component.
 * 
 * @component
 * 
 * @remarks
 * This component includes a slider that can be dragged to scroll the mapped element.
 * It also observes changes in the mapped element's children and size to queue redraws.
 * 
 */
const Minimap = (
  {
    elementToMap,
    queueRedraw,
    setQueueRedraw,
    isFullHtml = false,
  }:
    {
      elementToMap: HTMLElement | null,
      isFullHtml?: boolean,
      queueRedraw: boolean,
      setQueueRedraw: CallableFunction
    }
) => {
  const [mapScale, setMapScale] = useState(1)
  const [sliderHeight, setSliderHeight] = useState(100)
  const [sliderTop, setSliderTop] = useState(0)
  const [canvasLoading, setCanvasLoading] = useState(false)
  const minimapRef = useRef<HTMLDivElement>(null);


  // Function which handles drag scrolling of the slider.
  function handleSliderDrag(mouseY: number) {
    const minimap = minimapRef.current;
    if (!minimap || !elementToMap) return;
    let viewportHeight = elementToMap.offsetHeight
    if (isFullHtml) {
      viewportHeight = window.innerHeight
    }
    const minimapRect = minimap.getBoundingClientRect();
    const relativeMousePos = mouseY - minimapRect.top;
    const newScrollPos = (relativeMousePos + minimap.scrollTop) / mapScale - 0.5 * viewportHeight;
    elementToMap.scrollTo(
      {
        left: 0,
        top: newScrollPos,
        behavior: "instant",
      }
    );
  }

  function handleQueueRedraw() {
    setQueueRedraw(true)
  }

  // Add observers to look for changes in elementToMap and queue a redraw
  useEffect(() => {
    if (!elementToMap) return
    // console.log("observers attached!")
    const childObserver = createChildObserver(elementToMap, handleQueueRedraw)
    const sizeObserver = createSizeObserver(elementToMap, handleQueueRedraw)
    return () => {
      // console.log("observers disconnected!")
      childObserver.disconnect();
      sizeObserver.disconnect()
    };
  }, [elementToMap])


  // Add event listeners to listen to scroll events of elementToMap
  useEffect(() => {
    if (!elementToMap) return
    const minimap = minimapRef.current;
    if (!minimap) {
      return;
    }

    // Create function which syncs the slider and minimap scroll to the elementToMap's scroll
    const syncScroll = () => {
      const scrollPercentage = elementToMap.scrollTop / elementToMap.scrollHeight;
      const newSliderTop = elementToMap.scrollTop * mapScale;
      setSliderTop(newSliderTop);
      minimap.scrollTop = newSliderTop - (scrollPercentage * (minimap.clientHeight - (mapScale * elementToMap.offsetHeight)))
    };
    const syncMinimapScroll = (event: WheelEvent) => {
      event.preventDefault(); // Prevents default scrolling behavior
      elementToMap.scrollTop += event.deltaY;
    }

    // Add event listenters to the elementToMap and minimap elements to handle scrolling
    //  in both.
    syncScroll()
    if (isFullHtml) {
      window.addEventListener("scroll", syncScroll);
    } else {
      elementToMap.addEventListener("scroll", syncScroll);
    }
    minimap.addEventListener("wheel", syncMinimapScroll);
    return () => {
      if (isFullHtml) {
        window.removeEventListener("scroll", syncScroll);
      } else {
        elementToMap.removeEventListener("scroll", syncScroll);
      }
      minimap.removeEventListener("wheel", syncMinimapScroll)
    };
  }, [canvasLoading, elementToMap, isFullHtml, mapScale])

  // Update the sliderHeight when the mapScale and elementToMap is updated
  useEffect(() => {
    if (!elementToMap) return
    if (isFullHtml) {
      setSliderHeight(mapScale * window.innerHeight)
    } else {
      setSliderHeight(mapScale * elementToMap.offsetHeight)
    }
  }, [mapScale, elementToMap, isFullHtml])


  return (
    <div
      className="w-full h-full select-none text-black text-sm overflow-hidden"
    >
      <div
        className="overflow-y-hidden w-full h-full shadow-[0_0_20px_rgba(0,0,0,1)] bg-[#212121] relative"
        ref={minimapRef}
      >
        <MinimapCanvas
          queueRedraw={queueRedraw}
          setQueueRedraw={setQueueRedraw}
          elementToMap={elementToMap}
          setMapScale={setMapScale}
          setCanvasLoading={setCanvasLoading}
        />
        {elementToMap && <Slider
          sliderHeight={sliderHeight}
          scrollTop={sliderTop}
          handleDrag={handleSliderDrag}
        />}
      </div>
    </div>
  );
}

export default Minimap;
