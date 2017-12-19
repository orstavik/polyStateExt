import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ComputeListing} from "./ComputeListing.js";
import {Tools} from "./Tools.js";

export class StateTree extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {string} name
   * @param {Object} data
   */
  static makeOrUpdate(el, name, data) {
    el = el || new StateTree(true);
    el.updateState(name, data);
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
  }

  updateState(name, data) {
    this.state.childObjs = !data || !data.children ? [] : Object.entries(data.children);
    // this.rawChildren = data.children;
    if (!data)
      return;
    this.state.name = name;
    this.state.compute = data.compute;
    this.state.values = data.values;
    this.render();
  }

  render() {
    if (this.state.childObjs.length === 0) {
      this.html`
        ${StateTree._style()}
        <span class="details__key key--primitive">${this.state.name}</span>
        <span class="${StateTree.primitiveClass(this.state.values.newState)}">${String(this.state.values.newState)}</span>
        ${StateTree.makeComputeListing(this.state.compute)}
      `;
    } else {
      this.html`
        ${StateTree._style()}
        <details class="details">
          <summary class="details__summary">
            <span class="details__key">${this.state.name}</span>
            ${StateTree.makeComputeListing(this.state.compute)}
          </summary>
          ${this.state.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
            ${Tools.setAttribute(StateTree.makeOrUpdate(null, key, value), "class", 'details__value')}
          `)}
        </details>
      `;
    }
  }

  static makeComputeListing(compute) {
    return compute ? Tools.setAttribute(ComputeListing.makeOrUpdate(null, compute), "class", 'details__computed'): null;
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
          font-family: Consolas, "dejavu sans mono", monospace;
          line-height: 16px;
          white-space: nowrap;
        }
        :host(.details__value) {
          padding-left: 13px;
        }
        .key--primitive {
          margin-left: 13.5px;
        }
        .details__key {
          color: #881391
        }
        .details__key::after {
          content: ':';
        }
        .primitive--type-undefined,
        .primitive--type-null {
          color: #808080;
        }
        
        .primitive--type-boolean {
          color: #0d22aa;
        }
        
        .primitive--type-number {
          color: #1c00cf;
        }
        
        .primitive--type-string {
          color: #c41a16;
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
      </style>
    `;
  }

  static primitiveClass(value) {
    const type = (value === undefined || value === null) ? String(value) : (value.constructor.name).toLowerCase();
    return `details__value primitive--type-${type}`;
  }
}

customElements.define("state-tree", StateTree);

// flashPath(segments) {
//   let first = segments.shift();
//   this.name === first ? this.classList.add("flash") : this.classList.remove("flash");
//   if (segments.length === 0)
//     this.scrollIntoViewIfNeeded();
//   else{
//     if (this.rawChildren[segments[0]])
//       this.shadowRoot.querySelectorAll("state-detail").map(child => child.flashPath(segments));
//     else
//       alert("This part of your path is not to be found: " + segments.join("."));
//   }
// }