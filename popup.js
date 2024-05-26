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
document
  .querySelector('#close')
  .addEventListener('click', () => executeScript(closeMinimap))


// document refers to website
function refreshMinimap() {
  const minimap = document.querySelector("#minimap")
  const viewBox =  document.querySelector('[data-testid^="conversation-turn-"]').parentNode
  
  if (minimap) {
    minimap.innerHTML = viewBox.outerHTML
    minimap.scrollTop = (window.scrollY / document.body.scrollHeight) * minimap.scrollHeight;
  }
}

function activateMinimap() {
  let minimap = document.querySelector('#minimap')
  const viewBox =  document.querySelector('[data-testid^="conversation-turn-"]').parentNode

  function createMinimap() {
    minimap = document.createElement('div');
    minimap.id = 'minimap';
    document.body.appendChild(minimap);
  }

  function updateMinimap() {
    minimap.innerHTML = viewBox.outerHTML
    minimap.scrollTop = (window.scrollY / document.body.scrollHeight) * minimap.scrollHeight;
  };

  if (!minimap) {
    createMinimap();
    window.addEventListener('scroll', updateMinimap);
    updateMinimap();
  }
}

function closeMinimap() {
  const minimap = document.querySelector('#minimap')
  
  if (minimap) {
    minimap.remove();
  }
}