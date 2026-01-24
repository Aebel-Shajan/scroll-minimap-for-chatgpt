export default defineBackground(() => {
  browser.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdq7tEs5lVdQC4pfSAAgHwh5LWtyirKoyf7yJh1BsAu9JfY1Q/viewform?usp=publish-editor");

browser.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-ui") {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.id) {
      browser.tabs.sendMessage(tab.id, { type: "TOGGLE_UI" });
    }
  }
});

});
