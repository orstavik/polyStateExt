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
    // this.addEventListener("path-clicked", StateDetail.pathClicked);
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
    let stateTree = StateTree.makeOrUpdate(null, "state", visVersion, "state");
    stateTree.setAttribute("name", "state");
    stateTree.setAttribute("fullpath", "state");
    stateTree.setAttribute("class", "state-observer__state");
    return stateTree;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  _style(openedPaths, selectedPaths) {
    const selectedSelector = StateDetail.pathsToCSSSelectors(selectedPaths, ">span", "state.");
    const openSelector = StateDetail.pathsToCSSSelectors(openedPaths, ">state-tree", "");
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
        text-decoration: underline;
      }                                                                             
      state-tree {
        display: none;
        font-family: Consolas, "dejavu sans mono", monospace;
        line-height: 16px;
        white-space: nowrap;
        margin-left: 16px;
      }
      state-tree[name='state'],
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
    `;
  }

  static pathsToCSSSelectors(paths, ending, prepend) {
    if (!paths || !(paths instanceof Object) || Object.keys(paths).length === 0)
      return "inactive";
    return Object.keys(paths).map(path => StateDetail.pathToCSSSelectorFullPath(path, ending, prepend)).join(", ");
  }

  static pathToCSSSelectorFullPath(path, ending, prepend) {
    return `state-tree[fullpath='${prepend}${path}']` + ending;
  }
}

customElements.define("state-detail", StateDetail);