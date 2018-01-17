import {listenerFunc} from "/libs/app.js";

//1. load the content-script by sending a message to the background.js script that has access to load content scripts.
chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  filename: "content-script.js"
});

//2. connect the apps listener method to the messages coming in from the injected-script.
//   This listener will decorate the devtools-panel DOM with the incoming data.
chrome.runtime.onMessage.addListener(listenerFunc);

//3. get and inject the injected-script.
//   the injected-script will hook into the ITObservableState.debugHook method to process
//   and send messages for each debug state.
//   Only chrome.devtools.inspectedWindow.eval has access to do this.
(async function () {
  let response = await fetch("injected-script.js");
  let text = await response.text();
  chrome.devtools.inspectedWindow.eval(text);
})();