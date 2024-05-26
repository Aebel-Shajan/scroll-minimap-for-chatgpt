function executeScript(functionToExecute) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: functionToExecute
    });
  });
}

// document refers to popup.html
document
  .querySelector('#activate')
  .addEventListener('click', () => executeScript(activateMinimap));
document
.querySelector('#refresh')
  .addEventListener('click', () => executeScript(refreshMinimap))


// document refers to website
function refreshMinimap() {
  const minimap = document.querySelector("#minimap")
  if (minimap) {
    minimap.innerHTML = document.querySelector('[data-testid^="conversation-turn-"]').parentNode.outerHTML
    minimap.scrollTop = (window.scrollY / document.body.scrollHeight) * minimap.scrollHeight;
  }
}

function activateMinimap() {
  function createMinimap() {
    const minimap = document.createElement('div');
    minimap.id = 'minimap';
    document.body.appendChild(minimap);
  }

  function updateMinimap() {
    minimap.innerHTML = document.querySelector('[data-testid^="conversation-turn-"]').parentNode.outerHTML
    minimap.scrollTop = (window.scrollY / document.body.scrollHeight) * minimap.scrollHeight;
  };

  if (!document.querySelector('#minimap')) {
    createMinimap();
    window.addEventListener('scroll', updateMinimap);
    updateMinimap();
  }
}
