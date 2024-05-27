async function sendMessage(message) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  try {
    let response = await chrome.tabs.sendMessage(tab.id, {message: message});
    return response
  }
   catch (e) {
    alert("An error occured. \nRestart chrome for scroll minimap for chatgpt to work. \n This extension only works on chatgpt.com")
  }
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
