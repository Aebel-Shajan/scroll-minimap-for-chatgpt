async function sendMessage(message) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  return await chrome.tabs.sendMessage(tab.id, {message: message});
}


// document refers to popup.html
document
  .querySelector('#activate')
  .addEventListener('click', () => sendMessage('activate'));
document
  .querySelector('#refresh')
  .addEventListener('click', () => sendMessage('refresh'))
document
  .querySelector('#close')
  .addEventListener('click', () => sendMessage('close'))
