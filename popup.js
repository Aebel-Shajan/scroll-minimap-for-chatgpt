document.getElementById('activate').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: activateMinimap
      });
    });
  });
  
  function activateMinimap() {
    if (!document.getElementById('minimap')) {
      const minimap = document.createElement('div');
      minimap.id = 'minimap';
      minimap.style.position = 'fixed';
      minimap.style.top = '10px';
      minimap.style.right = '10px';
      minimap.style.width = '100px';
      minimap.style.height = '100vh';
      minimap.style.border = '1px solid #000';
      minimap.style.backgroundColor = '#f0f0f0';
      minimap.style.overflow = 'hidden';
      document.body.appendChild(minimap);
  
      const updateMinimap = () => {
        minimap.innerHTML = document.querySelector('#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden').innerHTML
  
        minimap.scrollTop = (window.scrollY / document.body.scrollHeight) * minimap.scrollHeight;
      };

      updateMinimap();
    }
  }
  