function handleMessage(request, sender, sendResponse) {
  if (sender.url != chrome.runtime.getURL("panel.html")) {
    return;
  }
  chrome.tabs.executeScript(
    request.tabId, {
      code: request.script
    });
}
chrome.runtime.onMessage.addListener(handleMessage);