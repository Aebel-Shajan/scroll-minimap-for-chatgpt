export default defineBackground(() => {
  browser.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdq7tEs5lVdQC4pfSAAgHwh5LWtyirKoyf7yJh1BsAu9JfY1Q/viewform?usp=publish-editor");

browser.commands.onCommand.addListener(async (command) => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id) return;

  const messageMap: Record<string, string> = {
    "toggle-ui": "TOGGLE_UI",
    "next-chat": "NEXT_CHAT",
    "previous-chat": "PREVIOUS_CHAT"
  };

  const messageType = messageMap[command];
  if (messageType) {
    browser.tabs.sendMessage(tab.id, { type: messageType });
  }
});

});
