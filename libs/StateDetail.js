import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";

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
    stateTree.setAttribute("class", "statetree");
    return stateTree;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  _style(openedPaths, selectedPaths, relevantPaths) {
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
      ${openSelector} {
        display: block;
      }
      ${this._treeStyle}
    `;
  }

  get _treeStyle() {
    return `
      .statetree {
        display: block;
        font-family: Consolas, "dejavu sans mono", monospace;
        line-height: 16px;
        white-space: nowrap;
      }
      .statetree>.statetree__subtree {
        display: block;
      }
      .statetree__subtree {
        display: none;
        padding-left: 13.5px;
      }
      .statetree__opener::before {
        content: "\\25b6";
        width: 14px;
        font-size: 10px;
        padding: 4px 0 4px 4px;
        pointer-events: auto;
      }
      .statetree--opened .statetree__opener::before {
        content: "\\25bc";
      }
      .statetree__key {
        color: var(--color-property-normal);
      }
      .statetree__key::after {
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
    `
  }

  static pathsToCSSSelectors(paths, ending) {
    if (!paths || !(paths instanceof Object) || Object.keys(paths).length === 0)
      return "inactive";
    return Object.keys(paths).map(path => StateDetail.pathToCSSSelectorFullPath(path, ending)).join(", ");
  }

  static pathToCSSSelectorFullPath(path, ending) {
    return `state-tree[fullpath='${path}']` + ending;
  }
}

customElements.define("state-detail", StateDetail);