import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateDetail} from "./StateDetail.js";
import {ObserverList} from "./ObserverList.js";
import TaskLI from "./TaskLI.js";
import {StateManager} from "./StateManager.js";
import {FlexibleGrid} from "./FlexibleGrid.js";
import {StatePath} from "./StatePath.js";
import {ObserveFunction} from "./ObserveFunction.js";
import {StateTree} from "./StateTree.js";

export class AppShell extends HyperHTMLElement {

  render() {
    this.html`
<flexible-grid class="topgrid" separator="300px" min-cols="260px 400px" direction-media="horizontal 660px vertical">
  <aside class="tasklist" slot="first">${this.state.tasks}</aside>
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
    this.state.tasks = [];
    this.render();

    //1. load the content-script by sending a message to the background.js script that has access to load content scripts.
    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      filename: "content-script.js"
    });

    this.state.stateDetail = document.querySelector("state-detail");
    this.state.observers = document.querySelector("observer-list");
    this.state.fluidStyle = document.querySelector("style#mainStyle");

    this.state.state = new StateManager();
    this.state.state.onChange(this.onStateChange.bind(this));

    chrome.runtime.onMessage.addListener(this.onNewStateFromApp.bind(this));

    (async function () {
      await AppShell.injectScriptInApp();
      AppShell.getHistory();
    })();
  }

  static async injectScriptInApp() {
    let response = await fetch("injected-script.js");
    let text = await response.text();
    chrome.devtools.inspectedWindow.eval(text);
  }

  onStateChange(newState) {
    this.state.stateDetail.render(newState.getFullTree());
    this.state.observers.render(newState.getObserverInfo(), newState.getSelectedPath());
    const fullList = newState.getFullList().reverse();
    for (let i = this.state.tasks.length; i < fullList.length; i++)
      this.state.tasks = this.state.tasks.concat([new TaskLI(fullList[i])]);
    this.render();
  }

  onNewStateFromApp(request, sender, sendResponse) {
    if (request.name !== 'new-client-state')
      return;
    this.state.state.addDebugInfo(JSON.parse(request.payload));
  };

  static getHistory() {
    chrome.devtools.inspectedWindow.eval("window.dispatchEvent(new CustomEvent('state-history-get'));");
  };
}

customElements.define("app-shell", AppShell);