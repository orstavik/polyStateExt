import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} visualVersion
   * @param {string} selectedPath
   */
  static makeOrUpdate(el, visualVersion, selectedPath) {
    el = el || new StateDetail(true);
    el.updateState(visualVersion, selectedPath);
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

  updateState(visualVersion, selectedPath) {
    this.state.visualVersion = visualVersion;
    this.state.selectedPath = selectedPath;
    this.render();
  }

  render() {
    this.html`
        ${StateDetail._style()}
        <h4 class="state__header">State</h4>
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
        }
        .state__header {
          margin: 0 0 12px;
        }
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
