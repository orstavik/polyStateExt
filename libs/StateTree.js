import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ComputeListing} from "./ComputeListing.js";

export class StateTree extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {string} name
   * @param {Object} data
   */
  static makeOrUpdate(el, name, data) {
    el = el || new StateTree(true);
    el._updateState(name, data);
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

  _updateState(name, data) {
    this.state.childObjs = !data || !data.children ? [] : Object.entries(data.children);
    if (!data)
      return;
    this.state.name = name;
    this.state.compute = data.compute;
    this.state.values = data.values;
    if (data.open)
      this.state.open = data.open;
    this.render();
  }

  // <!--<style>${StateTree._style()}</style>-->
  render() {
    if (this.state.childObjs.length === 0) {
      this.html`
        <span class="details__key key--primitive">${this.state.name}</span>
        <span class="${StateTree.primitiveClass(this.state.values.newState)}">${String(this.state.values.newState)}</span>
        ${StateTree.makeComputeListing(this.state.compute)}
      `;
    } else {
      this.html`
            <span class="details__key" onclick="${this.openDetail.bind(this)}">${this.state.name}</span>
            ${StateTree.makeComputeListing(this.state.compute)}
          ${this.state.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
            ${this.makeChildTree(key, value)}
          `)}  
      `;
    }
  }

  makeChildTree(key, value) {
    let el = StateTree.makeOrUpdate(null, key, value);
    el.addEventListener("state-open", this.extendOpen.bind(this));
    el.setAttribute("name", key);
    el.setAttribute("class", 'details__value');
    return el;
  }

  extendOpen(e){
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("state-open", {composed: true, bubbles: true, detail: this.state.name + "." + e.detail}));
  }

  openDetail(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("state-open", {composed: true, bubbles: true, detail: this.state.name}));
  }

  static makeComputeListing(compute) {
    if (!compute)
      return null;
    const el = ComputeListing.makeOrUpdate(null, compute);
    el.setAttribute("class", 'details__computed');
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

  static primitiveClass(value) {
    const type = (value === undefined || value === null) ? String(value) : (value.constructor.name).toLowerCase();
    return `details__value primitive--type-${type}`;
  }
}

customElements.define("state-tree", StateTree);

//     this.scrollIntoViewIfNeeded();
