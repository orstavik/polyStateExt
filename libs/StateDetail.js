import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";
import {ObserveFunction} from "./ObserveFunction.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} observerInfo
   * @param {Object} visualVersion
   * @param {string} selectedPath
   */
  static makeOrUpdate(el, observerInfo, visualVersion, selectedPath) {
    el = el || new StateDetail(true);
    el.updateState(observerInfo, visualVersion, selectedPath);
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
    this.addEventListener("path-clicked", StateDetail.pathClicked);
  }

  updateState(observerInfo, visualVersion, selectedPath) {
    this.state.visualVersion = visualVersion;
    this.state.observers = observerInfo ? Object.values(observerInfo) : undefined;
    this.state.selectedPath = selectedPath;
    this.render();
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {StateDetail.Props} props The new properties of this component
   */
  updateProps(props) {
    this.state = StateDetail.Props.update(props, this.state);
    this.render();
  }

  render() {
    this.html`
        ${this._renderObservers()}
        <h4 class="state-observer__header2">State</h4>
        ${StateDetail.makeStateTree(this.state.visualVersion)}
        <p>selected path: ${this.state.selectedPath}</p>
      `;
  }

  static makeStateTree(visVersion) {
    if (!visVersion)
      return null;
    let stateTree = StateTree.makeOrUpdate(null, "state", visVersion);
    stateTree.setAttribute("class", "state-observer__state");
    return stateTree;
  }

  _renderObservers() {
    if (!this.state.observers)
      return HyperHTMLElement.wire()`<h5>No observers registered</h5>`;

    return HyperHTMLElement.wire()`
      <h4 class="state-observer__header1">Observers</h4>
      <ul class="state-observer__observers">
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
      </style>
    `;
  }
}

customElements.define("state-detail", StateDetail);

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
