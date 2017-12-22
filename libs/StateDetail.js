import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";
import {Tools} from "./Tools.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} visualVersion
   */
  static makeOrUpdate(el, visualVersion, openedPaths, selectedPaths, relevants) {
    el = el || new StateDetail(true);
    el.updateState(visualVersion, openedPaths, selectedPaths, relevants);
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
    // this.addEventListener("path-clicked", StateDetail.pathClicked);
  }

  updateState(visualVersion, openedPaths, selectedPaths, relevants) {
    this.state.visualVersion = visualVersion;
    this.state.openedPaths = openedPaths;
    this.state.selectedPaths = selectedPaths;
    this.state.relevants= relevants;
    this.render();
  }

  render() {
    this.html`
      <style>${this._style(this.state.openedPaths, this.state.selectedPaths, this.state.relevants)}</style>
      <h4 class="state__header">State</h4>
      ${StateDetail.makeStateTree(this.state.visualVersion)}
    `;
  }

  static makeStateTree(visVersion) {
    if (!visVersion)
      return null;
    let stateTree = StateTree.makeOrUpdate(null, "state", visVersion, null);
    stateTree.setAttribute("name", "state");
    stateTree.setAttribute("class", "state-observer__state");
    return stateTree;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  _style(openedPaths, selectedPaths, relevantPaths) {
    if (!Tools.emptyObject(relevantPaths))
      openedPaths = Object.assign({}, selectedPaths, relevantPaths);
    openedPaths = StateDetail.openParentPaths(openedPaths);
    const selectedSelector = StateDetail.pathsToCSSSelectors(selectedPaths, "");
    const openSelector = StateDetail.pathsToCSSSelectors(openedPaths, ">state-tree");
    const relevantsSelector = StateDetail.pathsToCSSSelectors(relevantPaths, "");
    //language=CSS
    return `
      :host {
        display: block;
        padding: 12px 24px;
      }
      .state__header {
        margin: 0 0 12px;
      }
      ${selectedSelector} {
        border: 2px solid red;
      }                                                                             
      ${relevantsSelector} {
        border: 2px solid orange;
      }                                                                             
      state-tree {
        display: none;
        font-family: Consolas, "dejavu sans mono", monospace;
        line-height: 16px;
        white-space: nowrap;
        margin-left: 16px;
      }
      state-tree[name="state"],
      state-tree[name="state"]>state-tree,
      ${openSelector} {
        display: block;
      }
      .key--primitive {
        margin-left: 13.5px;
      }
      .details__key {
        color: var(--color-property-normal);
      }
      .details__key::after {
        content: ':';
      }
      .primitive--type-undefined,
      .primitive--type-null {
        color: var(--color-nothing-normal);
      }
      
      .primitive--type-boolean {
        color: var(--color-boolean-normal);
      }
      
      .primitive--type-number {
        color: var(--color-number-normal);
      }
      
      .primitive--type-string {
        color: var(--color-string-normal);
      }
      
      .primitive--type-string::before,
      .primitive--type-string::after {
        content: '"';
      }
      .details__summary {
        display: inline-block;
      }
      .details__summary:focus {
        outline: none;
      }
      .details__summary::-webkit-details-marker {
        margin-right: -1px;
      }

    `;
  }

  static pathsToCSSSelectors(paths, ending) {
    if (!paths || !(paths instanceof Object) || Object.keys(paths).length === 0)
      return "inactive";
    return Object.keys(paths).map(path => StateDetail.pathToCSSSelectorFullPath(path, ending)).join(", ");
  }

  static pathToCSSSelectorFullPath(path, ending) {
    return `state-tree[fullpath='${path}']` + ending;
  }

  static openParentPaths(openedPaths) {
    let res = {};
    for (let path of Object.keys(openedPaths)) {
      let parentPaths = path.split(".");
      for (let i = 1; i<=parentPaths.length; i++) {
        let pPath = parentPaths.slice(0,i);
        res[pPath.join(".")] = true;
      }
    }
    return res;
  }
}

customElements.define("state-detail", StateDetail);