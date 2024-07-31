// Create elements
let extensionContainer = document.createElement("div");
extensionContainer.id = "extension-container";
let optionContainer = document.createElement("div");
optionContainer.id = "option-container";
let toggleButton = document.createElement("button");
toggleButton.id = "toggle-minimap-button";
toggleButton.innerText = "Minimap for GPT";
optionContainer.appendChild(toggleButton);
//sidebar
// let sidebar = document.createElement("div");
// sidebar.id = "sidebar";
// optionContainer.appendChild(sidebar);

extensionContainer.appendChild(optionContainer);

let sourceElements, sourceScrollContainer;
let minimap = document.createElement("div");
minimap.id = "minimap";
hideElement(minimap);
let targetElements = document.createElement("div");
targetElements.id = "target-elements";
minimap.appendChild(targetElements);

extensionContainer.appendChild(minimap);
document.body.appendChild(extensionContainer);

toggleButton.addEventListener("mouseenter", () => {
    hideElement(optionContainer);
    showMinimap();
  });
  extensionContainer.addEventListener("mouseleave", () => {
    showElement(optionContainer);
    hideMinimap();
  });

//Functions

function getSourceElements() {
  try {
    const conversationTurns = document.querySelectorAll(
      '[data-testid^="conversation-turn-"]'
    );
    const extractedContent = document.createElement("div");

    conversationTurns.forEach((turn) => {
      const newTurn = document.createElement("div");
      newTurn.setAttribute("data-testid-extension", turn.getAttribute("data-testid"));

      const authorRoleElement = turn.querySelector(
        "[data-message-author-role]"
      );
      if (authorRoleElement) {
        const authorRole = authorRoleElement.getAttribute(
          "data-message-author-role"
        );
        newTurn.setAttribute("data-message-author-role", authorRole);

        if (authorRole === "user") {
          // User question: limit content
          const userContent = authorRoleElement.textContent.trim();
          newTurn.textContent = userContent;
          newTurn.classList.add("minimap-user-turn");
        } else if (authorRole === "assistant") {
          // Assistant response: limit content
          const content = turn.querySelector(".markdown.prose");
          if (content && content.textContent.trim()) {
            let trimmedContent = content.textContent.trim().substring(0, 100); //Limit to 100 characters
            if (content.textContent.length > 100) {
              trimmedContent += "......";
            }
            newTurn.textContent = trimmedContent;
            newTurn.classList.add("minimap-ai-turn");
          }
        }

        // Process File Attachments
        const fileAttachments = turn.querySelectorAll(
          ".overflow-hidden.rounded-xl"
        );
        fileAttachments.forEach((attachment) => {
          const fileInfo = attachment.querySelector(".truncate.font-semibold");
          const fileType = attachment.querySelector(
            ".truncate.text-token-text-tertiary"
          );
          if (fileInfo && fileType) {
            const attachmentParagraph = document.createElement("p");
            attachmentParagraph.textContent = `[${fileType.textContent}: ${fileInfo.textContent}]`;
            newTurn.appendChild(attachmentParagraph);
          }
        });

        // Process Image Attachments
        const imageAttachments = turn.querySelectorAll("img");
        imageAttachments.forEach(() => {
          const imagePlaceholder = document.createElement("p");
          imagePlaceholder.textContent = "[图片附件]";
          newTurn.appendChild(imagePlaceholder);
        });

        extractedContent.appendChild(newTurn);
      }
    });

    sourceElements = extractedContent;
  } catch (error) {
    console.error("Error extracting conversation elements:", error);
    sourceElements = document.createElement("div");
  }
}
// ChatGPT website's source container
function getSourceScrollContainer() {
  try {
    // Since I changed the structure of the page, I need to find the new scroll container
    sourceScrollContainer = document.querySelector(
      '[data-testid^="conversation-turn-"]'
    ).parentNode.parentNode;
    console.log(sourceScrollContainer);
  } catch {
    sourceScrollContainer = document.body.cloneNode(true);
    if (sourceElements.contains(extensionContainer)) {
      sourceElements.removeChild(extensionContainer);
    }
  }
}

function updateMinimap() {
  getSourceElements(); //use new function to get and rearrange source elements
  console.log(sourceElements);
  targetElements.innerHTML = ""; //clear the target elements to make sure it's empty
  Array.from(sourceElements.children).forEach((child) => {
    targetElements.appendChild(child.cloneNode(true));
  }); //copy the source elements to target elements(avoid append child directly)

}

function hideElement(element) {
  element.style.display = "none";
}

function showElement(element) {
  element.style.display = "initial";
}

function showMinimap() {
  showElement(minimap);
  refreshMinimap();
}

function hideMinimap() {
  hideElement(minimap);
}
function setupMinimapClickHandler() {
  if (minimap) {
    minimap.removeEventListener("click", minimapClickHandler);
    minimap.addEventListener("click", minimapClickHandler);
    console.log("Minimap click handler set up on:", minimap);
  } else {
    console.error("Minimap element not found");
  }
}
function scrollToElement(element) {
  if (!element) {
    console.error("No element provided to scroll to");
    return;
  }

  const stickyHeader = document.querySelector("#__next > div > div .sticky");
  const headerHeight = stickyHeader
    ? Math.max(stickyHeader.offsetHeight, 60)
    : 60;

  console.log("Header height:", headerHeight);

  // Calculate the offset top of the element
  let offsetTop = 0;
  let currentElement = element;
  while (currentElement) {
    offsetTop += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }

  // Subtract the header height to get the correct scroll position
  const scrollToPosition = offsetTop - headerHeight;

  //console.log("Calculated scroll position:", scrollToPosition);
  getSourceScrollContainer();
  // Scroll to the calculated position
  sourceScrollContainer.scrollTo({
    top: scrollToPosition,
    behavior: "smooth",
  });

  // check if the scroll has completed
  setTimeout(() => {
    const finalPosition = sourceScrollContainer.scrollY;
    console.log("Final scroll position:", finalPosition);
    if (Math.abs(finalPosition - scrollToPosition) > 5) {
      console.warn("Scroll may not have completed as expected");
      // if not, try scrolling again
      sourceScrollContainer.scrollTo({
        top: scrollToPosition,
        behavior: "auto",
      });
    }
  }, 1000);
  // console.log('Scroll function completed');
}
function minimapClickHandler(event) {
  // console.log('Minimap clicked', event);
  // console.log('Clicked target:', event.target);
  // console.log('Current target:', event.currentTarget);

  // Find the closest element with a data-testid attribute
  const clickedElement = event.target.closest("[data-testid]");
  console.log("Closest element with data-testid:", clickedElement);

  if (clickedElement) {
    const testId = clickedElement.getAttribute("data-testid");
    console.log("TestId:", testId);

    // Check if the clicked element is a conversation turn
    if (testId.includes("conversation-turn-")) {
      const originalTurn = document.querySelector(
        `#__next [data-testid="${testId}"]:not(#minimap *)`
      );
      if (originalTurn) {
        scrollToElement(originalTurn);
        // console.log('Scrolling to:', originalTurn);
      } else {
        console.log("Original turn not found in main content");
      }
    } else {
      console.log("Clicked element is not a conversation turn");
    }
  } else {
    console.log("No element with data-testid found");
  }
}
function refreshMinimap() {
  updateMinimap();
  setupMinimapClickHandler(); // Add click handler to the minimap
//   if (sourceScrollContainer) {
//     if (sourceScrollContainer.getAttribute("listener") !== "true") {
//       sourceScrollContainer.addEventListener("scroll", updateMinimap);
//     }
//   }
}
const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const conversationTurns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
            if (conversationTurns.length > 0) {
                observer.disconnect(); // 临时断开观察器
                updateMinimap();
                console.log(targetElements)
                observer.observe(document.body, { childList: true, subtree: true }); // 重新连接观察器
                
                // getSourceElements();
                // console.log(sourceElements);
                break; 
            }
        }
    }
});


observer.observe(document.body, { childList: true, subtree: true });

