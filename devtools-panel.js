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

/*
 * HOW TO DEBUG?
 *
 * 1) content-script:
 * in "normal devtools" > sources > content scripts.
 *
 * 2) injected-script:
 * in "normal devtools" > console > click on console.info message with a link to the injected script.
 *
 * 3) dev-tools panel app.js and all sub files:
 * a) in "normal devtools" > rightclick with mouse on panel polyState > inspect  => opens "devtools of devtools".
 * b) in "devtools of devtools" the app.js files are under sources.
 */