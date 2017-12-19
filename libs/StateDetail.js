import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import StateTree from "./StateTree.js";
import {ObserveFunction} from "./ObserveFunction.js";

class StateDetail extends HyperHTMLElement {

  /**
   * Creates an instance of StateDetail
   * @param {StateDetail.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this.state = props;
    this.render();
    this.addEventListener("path-clicked", StateDetail.pathClicked);
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
        ${this.state.visualVersion ?
          new StateTree(new StateTree.Props("state", this.state.visualVersion), {class: "state-observer__state"}) :
          null
        }
        <p>selected path: ${this.state.selectedPath}</p>
      `;
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

StateDetail.Props = class {
  /**
   * @param {Object} observerInfo the whole debugInfo
   * @param {Object} visualVersion computed merged into the state detail
   */
  constructor(observerInfo, visualVersion, selectedPath) {
    this.visualVersion = visualVersion;
    this.observers = observerInfo ? Object.values(observerInfo) : undefined;
    this.selectedPath = selectedPath;
  }

  static update(newProps, oldProps) {
    return newProps;
  }
};

export default StateDetail;
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
