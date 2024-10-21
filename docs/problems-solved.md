# Problems solved

## Problem : Detect when the user goes to a new chat and refresh the minimap

When the user switches to a new chat, I want to refresh the minimap canvas to 

Attempt 1 : Use mutation observer on document.body

```javascript
executeOnElementChange(triggerCanvasRefresh, document.body)

function executeOnElementChange(callback: MutationCallback, element: HTMLElement) {
  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: false };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(element, config);
}
```

Results:
    * Did not detect changes when user moved to new chat. (Maybe I did not setup the config properly?)
    * Did detect changes to the minimap, causing an infinite loop.

Attempt 2 : Use location.href

```javascript
// Global variable
let lastUrl: string = ""

// On initial render start observing document
executeOnElementChange(refreshOnAddressChange, document)

function refreshOnAddressChange() {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentURl
        triggerCanvasRefresh()
    }
}

function executeOnElementChange(callback: MutationCallback, element: HTMLElement | Document) {
  // Options for the observer (which mutations to observe)
  const config = {childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(element, config);
}
```

Results : 
    * Changing the config & using the document as a whole fixed the changes not being detected.
    * Checking for the url change stops the infinite loop.
    * It works but the function fires every time any changes happen in the dom. (Could this impact performace??)



## Problem : When the page changes, we try querying for a chat container before it has actually loaded

Attempt 1 : Call the function again 500ms later if the chat container has not been found: 

```javascript
  function triggerCanvasRefresh() {
    // changing state always triggers a refresh of parent and child states (excluding memo compnents)
    chatContainer.current = queryChatContainer()
    if (chatContainer.current) {
      scrollContainer.current = chatContainer.current.parentElement;
      setManualRefresh((temp) => !temp);
    } else {
      if (refreshRetryCount < 10) {
        // Call function again with a delay to see if it can be found later on
        refreshRetryCount += 1
        setTimeout(triggerCanvasRefresh, 500)
      } else {
        // After 10 calls if no chat container is found render anyway.
        // This should show an error screen on the minimap
        refreshRetryCount = 0
        setManualRefresh((temp) => !temp);
      }

    }
  }
```
Results: 
* Works for the most part, if the chat container is not found it calls the functions again later.
* I have seen instances where it fails to find the chat container, however the error message does not get displayed. Instead the minimap just keeps the same image.