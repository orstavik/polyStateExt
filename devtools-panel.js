import {listenerFunc} from "/libs/app.js";

//1. load the content-script by sending a message to the background.js script that has access to load content scripts.
//   Att! the content-script loaded as a file can be debugged in the content-script tab in the application window.
chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  filename: "content-script.js"
});

//2. add listener for new client states that decorate the devtools-panel DOM
chrome.runtime.onMessage.addListener(listenerFunc);

//3. get and inject the injected-script.
//   the injected-script will hook into the ITObservableState.debugHook method to process
//   and send messages for each debug state.
//   Only chrome.devtools.inspectedWindow.eval has access to do this.
//   Att!! If you need to debug the injected script, the content of the injected script must be added to the running app
//         as a normal js code, for example as part of the ITObservableState.js file.
(async function () {
  let response = await fetch("injected-script.js");
  let text = await response.text();
  chrome.devtools.inspectedWindow.eval(text);
})();