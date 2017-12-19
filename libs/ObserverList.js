import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ObserveFunction} from "./ObserveFunction.js";

export class ObserverList extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} observerInfo
   * @param {string} selectedPath
   */
  static makeOrUpdate(el, observerInfo, selectedPath) {
    el = el || new ObserverList(true);
    el.updateState(observerInfo, selectedPath);
    return el;
  }

  /**
   * An entry for a computed trigger
   */
  constructor(skipRender) {
    super();
    this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
  }

  updateState(observerInfo, selectedPath) {
    this.state.observers = observerInfo ? Object.values(observerInfo) : undefined;
    this.state.selectedPath = selectedPath;
    this.render();
  }

  render() {
    if (!this.state.observers)
      return this.html`<h5>No observers registered</h5>`;

    return this.html`
      ${ObserverList._style()}
      <h4 class="observer__header">Observers</h4>
      <ul class="observer__observers">
        ${this.state.observers.map(observer => HyperHTMLElement.wire()`
          ${ObserveFunction.makeOrUpdate(null, observer)}
        `)}
      </ul>
    `;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  static _style() {
    return HyperHTMLElement.wire()`
      <style>
        :host {
          display: block;
          padding: 12px 24px;
          border-bottom: 1px solid var(--default-border-color);
        }
        .observer__header {
          margin: 0 0 12px;
        }
        .observer__observers {
          padding: 0;
          margin: 0;
        }
      </style>
    `;
  }
}

customElements.define("observer-list", ObserverList);

// static pathClicked (e){
//   alert("path clicked: " + e.detail);
//   let segments2 = ("state."+e.detail).split(".");
//   let stateTree = this.shadowRoot.querySelector("state-tree");
//   stateTree.flashPath(segments2);
//   // while (segments2.length){
//   //   let first = segments2.shift();
//   //   stateTree = stateTree.shadowRoot.querySelector("state-tree." + first);
//   //   if (!stateTree)
//   //     return alert("no such path: " + e.detail);
//   //   stateTree.classList.toggle("flash");
//   // }
//   // const oldFlash = document.querySelectorAll(".flash");
//   // for (let oldi of oldFlash)
//   //   oldi.classList.remove("flash");
//   //
//   // const index = e.path[5].contentID;
//   // let segments = e.currentTarget.textContent.split(".");
//   //
//   // for (let i = 0; i < segments.length; i++) {
//   //   let partialPath = segments.slice(0, segments.length - i);
//   //   let argPath = partialPath.join("_");
//   //   let detail = document.querySelector("#" + index + "_state_" + argPath);
//   //   detail.classList.add("opened");
//   // }
//   //
//   // let argPath = segments.join("_");
//   // let detail = document.querySelector("#s" + index + "_state_" + argPath);
//   // detail.classList.add("flash");
// };
