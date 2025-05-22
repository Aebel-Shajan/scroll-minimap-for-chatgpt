


/**
 * Observes the DOM for the addition or removal of an element with a specific selector.
 *
 * @param elementSelector - The selector of the element to observe.
 * @param onElementAdd - Callback function to be called when the element is added to the DOM.
 * @param onElementRemove - Callback function to be called when the element is removed from the DOM.
 * @returns A MutationObserver instance that is observing the DOM.
 */
export function elementObserver(
  elementSelector: string,
  onElementAdd: CallableFunction,
  onElementRemove: CallableFunction
): MutationObserver {
  const observer = new MutationObserver((mutationsList, ) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check for added nodes
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return 
          if (node.matches(elementSelector)) {
            console.log(`Element with selector ${elementSelector} was added to the DOM.`);
            onElementAdd(elementSelector)
          }
        });

        // Check for removed nodes
        mutation.removedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return 
          if (node.matches(elementSelector)) {
            console.log(`Element with selector ${elementSelector} was removed from the DOM.`);
            onElementRemove()
          }
        });
      }
    }
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
  return observer
}


/**
 * Creates a MutationObserver that observes changes to the child elements of a specified 
 * element. When a mutation occurs, the provided callback function is executed.
 *
 * @param {HTMLElement} elementToObserve - The element whose child elements will be 
 *  observed.
 * @param {CallableFunction} callback - The function to be called when a mutation is 
 *  observed.
 * @returns {MutationObserver} The created MutationObserver instance.
 * 
 * @remarks 🤨
 */
export function createChildObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): MutationObserver {
  const mutationObserver = new MutationObserver(function (mutations) {
    const minimapComponent = document.querySelector("#minimap-component")
    if (!minimapComponent) return
    mutations.forEach(function (mutation) {
      const targetElement = mutation.target as HTMLElement;
      if (targetElement.id === "minimap-component" || minimapComponent.contains(targetElement)) return;
      callback()
      console.log(mutation);
    });
  });

  mutationObserver.observe(elementToObserve, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false,
  });
  return mutationObserver
}


/**
 * Creates a ResizeObserver to observe size changes on a given HTML element and executes
 * a callback function when a resize is detected.
 *
 * @param {HTMLElement} elementToObserve - The HTML element to observe for size changes.
 * @param {CallableFunction} callback - The callback function to execute when a resize 
 *  is detected.
 * @returns {ResizeObserver} The created ResizeObserver instance.
 */
export function createSizeObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): ResizeObserver {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      console.log("Resize observed:", entry);
    }
    callback()
  });

  resizeObserver.observe(elementToObserve);
  return resizeObserver
}
