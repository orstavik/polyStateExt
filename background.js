function handleMessage(request, sender, sendResponse) {
  if (sender.url != chrome.runtime.getURL("devtools-panel.html")) {
    return;
  }
  chrome.tabs.executeScript(
    request.tabId, {
      file: request.filename
    });
}
chrome.runtime.onMessage.addListener(handleMessage);