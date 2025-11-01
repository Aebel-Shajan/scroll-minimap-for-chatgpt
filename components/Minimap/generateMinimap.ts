


/**
 * Returns image of element passed in.
 *
 * @param elementToRender - The element to render as a minimap containing chat messages.
 * @returns A Promise that resolves to void.
 */
// export default async function generateMinimapCanvas(
//   elementToRender: HTMLElement,
//   renderOptions: Partial<Options> = {}
// ): Promise<HTMLCanvasElement> {

//   const rootElement = document.documentElement;
//   const rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;

//   const options: Partial<Options> = {
//     ...renderOptions,
//     scrollX: 0,
//     scrollY: 0,
//     scale: 0.25,
//     backgroundColor: rootBackgroundColor,
//     onclone(document: Document, element: HTMLElement) {
//       removeOverflowRestriction(element)
//       // removeAllImages(document)
//       // removeChatMargins(element)
//       // colorUserChats(element)      
//     },
//   };

//   // Generate the canvas
//   const canvas = await html2canvas(elementToRender, options);
//   return canvas;
// }
import { toCanvas } from 'html-to-image';
import { Options } from 'html-to-image/lib/types';

export default async function generateMinimapCanvas(
  elementToRender: HTMLElement,
): Promise<HTMLCanvasElement> {
  const rootElement = document.documentElement;
  const rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;


  // html-to-image supports options like backgroundColor, cacheBust, width, height, etc.
  const options: Options = {
    backgroundColor: rootBackgroundColor,
    height: elementToRender.scrollHeight,
    pixelRatio: 0.25,

    // ...renderOptions,
  };
  const canvas = await toCanvas(elementToRender, options);
  return canvas
}




function removeOverflowRestriction(element: HTMLElement) {
  // Set the element to show its full height
  element.style.height = "auto";
  element.style.overflow = "visible";
}


function removeAllImages(documentClone: Document) {
  documentClone.querySelectorAll("img").forEach(img => {
    const width = img.width;
    const height = img.height;

    // Replace the image with a grey placeholder div
    const greyBox = documentClone.createElement("div");
    greyBox.style.width = `${width}px`;
    greyBox.style.height = `${height}px`;
    greyBox.style.background = "white";
    greyBox.style.display = "inline-block"; // Ensure it doesn't collapse
    greyBox.style.border = "1rem solid red"; // Add red border
    greyBox.style.borderRadius = "10px"; // Add curved corners

    img.replaceWith(greyBox);
  })
}

export function removeChatMargins(element: HTMLElement) {
  let chatWidth = 0;
  element.querySelectorAll(".mx-auto").forEach((k) => {
    const j = k as HTMLElement;
    j.style.marginLeft = "0px";
    j.style.marginRight = "0px";
    if (j.parentElement) {
      j.parentElement.style.paddingRight = "0px";
      j.parentElement.style.paddingLeft = "0px"
    }
    chatWidth = j.offsetWidth;
  });
  element.style.width = `${chatWidth}px`;
  if (chatWidth === 0) {
    element.style.width = "fit-content";
  }
}

function colorUserChats(element: HTMLElement) {
  // Color user chat white
  element
    .querySelectorAll('[data-message-author-role="user"]')
    .forEach((k) => {
      const j = k as HTMLElement;
      j.style.backgroundColor = "#7cffd1";
    });
}