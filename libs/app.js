import {StateDetail} from "./StateDetail.js";
import {ObserverList} from "./ObserverList.js";
import TaskLI from "./TaskLI.js";
import {StateManager} from "./StateManager.js";

//2a. get shortcuts to DOM elements in devtools-panel that will be decorated
const state = new StateManager();

const stateDetail = document.querySelector("state-detail");
const observers = document.querySelector("observer-list");

state.onChange(function (newState) {
  // StateDetail.makeOrUpdate(stateDetail, newState.getVisualVersion(), newState.getOpenPaths(), newState.getSelectedPath(), newState.getRelevants());
  StateDetail.makeOrUpdate(stateDetail, ...newState.getWrapperPaths());
  ObserverList.makeOrUpdate(observers, newState.getObserverInfo(), newState.getSelectedPath());
});

const tasksList = document.querySelector("aside.tasklist");

//2b.
//    Att! the devtools-panel.js script can be debugged by right-clicking on the panel in devtools -> inspect.
export const listenerFunc = function (request, sender, sendResponse) {
  debugger;
  if (request.name === 'new-client-state') {
    let data = JSON.parse(request.payload);
    let id = state.addDebugInfo(data);
    tasksList.append(new TaskLI(new TaskLI.Props(id, data.task), {
      id: 'task_' + id,
      class: 'tasklist__item task',
      'data-index': id
    }));
  }
};
