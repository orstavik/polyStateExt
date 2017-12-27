import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ComputeListing} from "./ComputeListing.js";

export class StateTree extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {string} name
   * @param {Object} data
   */
  static makeOrUpdate(el, name, data, fullpath) {
    el = el || new StateTree(true);
    el._updateState(name, data, fullpath);
    return el;
  }

  /**
   * An entry for a computed trigger
   */
  constructor(skipRender) {
    super();
    // this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
  }

  _updateState(name, data, fullpath) {
    this.state.childObjs = !data || !data.children ? [] : Object.entries(data.children);
    if (!data)
      return;
    this.state.name = name;
    this.state.fullpath = fullpath;
    this.state.compute = data.compute;
    this.state.values = data.values;
    if (data.open)
      this.state.open = data.open;
    this.render();
  }

  render() {
    //        <style>${StateTree._style()}</style>
    if (this.state.childObjs.length === 0) {
      this.html`
        <span class="statetree__key key--primitive">${this.state.name}</span>
          <span class="statetree__oldvalue">
            <span class="${StateTree.primitiveClass(this.state.values.startState)}">${String(this.state.values.startState)}</span>
            =>
          </span>
        <span class="${StateTree.primitiveClass(this.state.values.newState)}">${String(this.state.values.newState)}</span>
        ${StateTree.makeComputeListing(this.state.compute)}
      `;
    } else {
      this.html`
        <span class="statetree__opener" onclick="${this.openDetail.bind(this)}"></span>
        <span class="statetree__key key--composite" onclick="${this.openDetail.bind(this)}">${this.state.name}</span>
        ${StateTree.makeComputeListing(this.state.compute)}
        </br>
        ${this.state.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
          ${this.makeChildTree(key, value, this.state.fullpath)}
        `)}
      `;
    }
  }

  makeChildTree(key, value, fullpath) {
    fullpath = fullpath ? fullpath + "." + key : key;
    let el = StateTree.makeOrUpdate(null, key, value, fullpath);
    el.setAttribute("name", key);
    el.setAttribute("fullpath", fullpath);
    el.setAttribute("class", 'statetree__subtree');
    return el;
  }

  openDetail(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("state-open", {composed: true, bubbles: true, detail: this.state.fullpath}));
  }

  static makeComputeListing(compute) {
    if (!compute)
      return null;
    const el = ComputeListing.makeOrUpdate(null, compute);
    el.setAttribute("class", 'statetree__computed');
    return el;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  static _style() {
    // language=CSS
    return `
      state-tree .details__value {
        padding-left: 13px;
      }
      state-tree {
        cursor: crosshair;
      }
    `;
  }

  static primitiveClass(value) {
    const type = (value === undefined || value === null) ? String(value) : (value.constructor.name).toLowerCase();
    return `statetree__value primitive--type-${type}`;
  }
}

customElements.define("state-tree", StateTree);

//     this.scrollIntoViewIfNeeded();
