import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} visualVersion
   */
  static makeOrUpdate(el, visualVersion, openedPaths, selectedPaths) {
    el = el || new StateDetail(true);
    el.updateState(visualVersion, openedPaths, selectedPaths);
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

  updateState(visualVersion, openedPaths, selectedPaths) {
    this.state.visualVersion = visualVersion;
    this.state.openedPaths = openedPaths;
    this.state.selectedPaths = selectedPaths;
    this.render();
  }

  render() {
    this.html`
      <style>${this._style(this.state.openedPaths, this.state.selectedPaths)}</style>
      <h4 class="state__header">State</h4>
      ${StateDetail.makeStateTree(this.state.visualVersion)}
    `;
  }

  static makeStateTree(visVersion) {
    if (!visVersion)
      return null;
    let stateTree = StateTree.makeOrUpdate(null, "state", visVersion);
    stateTree.setAttribute("name", "state");
    stateTree.setAttribute("class", "state-observer__state");
    return stateTree;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  _style(openedPaths, selectedPaths) {
    const openedPathsSelects = StateDetail.pathsToCSSSelectors(selectedPaths);
    const selectedPathsSelect = StateDetail.pathsToCSSSelectors(openedPaths);
    //language=CSS
    return `
      :host {
        display: block;
        padding: 12px 24px;
      }
      .state__header {
        margin: 0 0 12px;
      }
      ${openedPathsSelects} {
        text-decoration: line-through;
      }
      ${selectedPathsSelect} {
        font-weight: bold;
      }
    `;
  }

  static pathsToCSSSelectors(paths) {
    if (!paths || !(paths instanceof Object) || Object.keys(paths).length === 0)
      return "inactive";
    return Object.keys(paths).map(path => StateDetail.pathToCSSSelector(path)).join(", ");
  }

  static pathToCSSSelector(path) {
    return path.split(".").map(str => `state-tree[name='${str}']`).join(">details>") + ">details>summary";
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
