import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateDetail} from "./StateDetail.js";
import {ObserverList} from "./ObserverList.js";
import TaskLI from "./TaskLI.js";
import {StateManager} from "./StateManager.js";


export class AppShell extends HyperHTMLElement {

  render() {
    this.html`
<flexible-grid class="topgrid" separator="300px" min-cols="260px 400px" direction-media="horizontal 660px vertical">
  <aside class="tasklist" slot="first"></aside>
  <main class="state" slot="second">
    <flexible-grid class="stategrid" separator="300px" min-cols="100px 200px" direction="vertical">
      <observer-list slot="first"></observer-list>
      <state-detail slot="second"></state-detail>
    </flexible-grid>
  </main>
</flexible-grid>
    `;
  }

  constructor() {
    super();
    this.render();

    //1. load the content-script by sending a message to the background.js script that has access to load content scripts.
    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      filename: "content-script.js"
    });

    //2a. get shortcuts to DOM elements in devtools-panel that will be decorated
    this.state.state = new StateManager();

    const stateDetail = document.querySelector("state-detail");
    const observers = document.querySelector("observer-list");
    const fluidStyle = document.querySelector("style#mainStyle");

    this.state.state.onChange(function (newState) {
      // fluidStyle.innerHTML = newState.getStyle();
      // StateDetail.makeOrUpdate(stateDetail, newState.getVisualVersion(), newState.getOpenPaths(), newState.getSelectedPath(), newState.getRelevants());
      // StateDetail.makeOrUpdate(stateDetail, newState.getVisualVersion(), newState.getWrapperPaths());
      stateDetail.render(newState.getFullTree());
      ObserverList.makeOrUpdate(observers, newState.getObserverInfo(), newState.getSelectedPath());
      console.log(newState);
    });
    this.state.tasksList = document.querySelector("aside.tasklist");

    //2. connect the apps listener method to the messages coming in from the injected-script.
//   This listener will decorate the devtools-panel DOM with the incoming data.
    chrome.runtime.onMessage.addListener(this.listenerFunc.bind(this));

    //3. get and inject the injected-script.
//   the injected-script will hook into the ITObservableState.debugHook method to process
//   and send messages for each debug state.
//   Only chrome.devtools.inspectedWindow.eval has access to do this.
    (async function () {
      let response = await fetch("injected-script.js");
      let text = await response.text();
      chrome.devtools.inspectedWindow.eval(text);
      this.getHistory();
    }.bind(this))();
  }

  //2b.
  //    Att! the devtools-panel.js script can be debugged by right-clicking on the panel in devtools -> inspect.
  listenerFunc(request, sender, sendResponse) {
    debugger;
    if (request.name === 'new-client-state') {
      let data = JSON.parse(request.payload);
      let id = this.state.state.addDebugInfo(data);
      this.state.tasksList.append(new TaskLI(new TaskLI.Props(id, data.task), {
        id: 'task_' + id,
        class: 'tasklist__item task',
        'data-index': id
      }));
    }
  };

  getHistory() {
    chrome.devtools.inspectedWindow.eval("window.dispatchEvent(new CustomEvent('state-history-get'));");
  };

}

customElements.define("app-shell", AppShell);

