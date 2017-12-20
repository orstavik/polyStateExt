import {StateDetail} from "./libs/StateDetail.js";
import {ObserverList} from "./libs/ObserverList.js";
import TaskLI from "./libs/TaskLI.js";
import {StateManager} from "./libs/StateManager.js";

//1. load the content-script by sending a message to the background.js script that has access to load content scripts.
//   Att! the content-script loaded as a file can be debugged in the content-script tab in the application window.
chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  filename: "content-script.js"
});

//2a. get shortcuts to DOM elements in devtools-panel that will be decorated
const stateDetail = document.querySelector("state-detail");
const observers = document.querySelector("observer-list");

const state = new StateManager();
state.onChange(function (newState) {
  StateDetail.makeOrUpdate(stateDetail, newState.getVisualVersion(), null);
  ObserverList.makeOrUpdate(observers, newState.getObserverInfo(), null);
});

const tasksList = document.querySelector("aside.tasklist");

//2b. add listener for new client states that decorate the devtools-panel DOM
//    Att! the devtools-panel.js script can be debugged by right-clicking on the panel in devtools -> inspect.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.name === 'new-client-state') {
    let data = JSON.parse(request.payload);
    let id = state.addDebugInfo(data);
    tasksList.append(new TaskLI(new TaskLI.Props(id, data.task), {
      id: 'task_' + id,
      class: 'tasklist__item task',
      'data-index': id
    }));
  }
});

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