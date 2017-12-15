import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";
import {ObserveFunction} from "./ObserveFunction.js";

export class StateDetail extends HyperHTMLElement {

  static make(debugInfo, visualVersion, id) {
    const res = new StateDetail();
    res.updateDebug(debugInfo, visualVersion, id);
    return res;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setDebug(null, null, 0);
  }

  setDebug(debugInfo, visualVersion, id) {
    if (!debugInfo)
      return;
    this.debugInfo = debugInfo;
    this.observers = Object.values(debugInfo.observerInfo);
    this.visualVersion = visualVersion;
    this.id = id;
  }

  updateDebug(debugInfo, visualVersion, id) {
    this.setDebug(debugInfo, visualVersion, id);
    this.render();
  }

  render() {

    if (this.observers.length !== 0) {
      this.html`
        <h4 class="state-observer__header1">Observers</h4>
        <ul class="state-observer__observers">
          ${this.observers.map(observer => HyperHTMLElement.wire()`
            ${ObserveFunction.make(observer)}
          `)}
        </ul>
        <h4 class="state-observer__header2">State</h4>
        ${StateTree.make(this.id + "_state", this.visualVersion)}
      `;
    } else {
      this.html`
        <h5>No observers registered</h5>
      `;
    }
  }
}

customElements.define("state-detail", StateDetail);