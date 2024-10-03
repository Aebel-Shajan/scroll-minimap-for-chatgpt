import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";

const Minimap = () => {
  const minimapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("minimap rendered");
    observeChanges();
  }, []);
  function observeChanges() {
    const firstChatMessage = document.querySelector(
      '[data-testid^="conversation-turn-"]'
    );
    let chatMessageContainer = null;
    let scrollHandlerContainer = null;
    if (firstChatMessage) {
      console.log("first chat messages found");
      chatMessageContainer = firstChatMessage.parentNode;
    }
    if (chatMessageContainer) {
      console.log("chat message container found");
      scrollHandlerContainer = chatMessageContainer.parentNode;
    }
    if (scrollHandlerContainer) {
      console.log("scroll handler found");
      const observer = new MutationObserver(() => {
        console.log("mutation detected");
        const newScrollSource = chatMessageContainer as HTMLElement;
        addImageToMinimap(minimapRef, newScrollSource)
      });
      observer.observe(scrollHandlerContainer, {
        childList: true,
        subtree: true,
      });
    }
  }

  return (
    <div
      className="minimap-container"
      style={minimapContainerStyle}
      ref={minimapRef}
    >
    </div>
  );
};

const minimapContainerStyle: React.CSSProperties = {
  width: "10rem",
  height: "90vh",
  backgroundColor: "green",
  pointerEvents: "all",
  objectFit: "contain",
};

async function addImageToMinimap(
  minimapRef: React.RefObject<HTMLDivElement>,
  element: HTMLElement
) {
  if (!minimapRef.current) {
    return;
  }

  const elementStyle = getComputedStyle(element)
  const elementWidth = parseInt(elementStyle.width, 10)
  console.log("elementWidth", elementWidth)
  const canvas = await html2canvas(element, {
    onclone: (doc, e) => {
      e.style.position = "absolute"
      e.style.top = "0px";
      e.style.right = "0px";
      e.style.height = "fit-content"
      e.style.border = "10px red solid"
      e.style.width = "fit-content"
    },
    ignoreElements: (element) => element.classList.contains("top-0"),
    // x: -0.32 * elementWidth,
    scrollX: 0,
    scrollY: 0,
    foreignObjectRendering: true,
    backgroundColor: "#000",
  });
  minimapRef.current.innerHTML = "";
  minimapRef.current.appendChild(canvas)
}

// function fitToContainer(canvas: HTMLCanvasElement){
//   // Make it visually fill the positioned parent
//   canvas.style.width ='100%';
//   canvas.style.height='100%';
//   // ...then set the internal size to match
//   canvas.width  = canvas.offsetWidth;
//   canvas.height = canvas.offsetHeight;
// }

export default Minimap;
