async function sendMessage(message) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  return await chrome.tabs.sendMessage(tab.id, {message: message});
}


// document refers to popup.html
document
  .querySelector('#show')
  .addEventListener('click', () => sendMessage('show'));
document
  .querySelector('#refresh')
  .addEventListener('click', () => sendMessage('refresh'))
document
  .querySelector('#hide')
  .addEventListener('click', () => sendMessage('hide'))
