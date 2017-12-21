import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} visualVersion
   */
  static makeOrUpdate(el, visualVersion, highlights, selected) {
    el = el || new StateDetail(true);
    el.updateState(visualVersion, highlights, selected);
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

  updateState(visualVersion, highlights, selected) {
    this.state.visualVersion = visualVersion;
    this.state.highlights= highlights;
    this.state.selected= selected;
    this.render();
  }

  render() {
    this.html`
      <style>${this._style(this.state.highlights, this.state.selected)}</style>
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
  _style(paths, selected) {
    let generatedCss = "";
    if (paths && paths instanceof Object && Object.keys(paths).length > 0) {
      for (let path in paths) {
        let cssPath = path.split(".").map(str => `state-tree[name='${str}']`).join(">details>") + ">details>summary";
        generatedCss += cssPath + "{ font-weight: bold; } "
      }
    }
    if (selected && selected instanceof Object && Object.keys(selected).length > 0) {
      let select = Object.keys(selected)[0];
        let cssPath = select.split(".").map(str => `state-tree[name='${str}']`).join(">details>") + ">details>summary";
        generatedCss += cssPath + "{ text-decoration: line-through; } "
    }
    return `
      :host {
        display: block;
        padding: 12px 24px;
      }
      .state__header {
        margin: 0 0 12px;
      }
      ${generatedCss}
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
