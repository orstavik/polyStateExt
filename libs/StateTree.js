import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ComputeListing} from "./ComputeListing.js";

class StateTree extends HyperHTMLElement {

  /**
   * Creates an instance of StateDetail
   * @param {StateTree.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this.state = props;
    this.render();
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {StateTree.Props} props The new properties of this component
   */
  updateProps(props) {
    this.state = StateTree.Props.update(props, this.state);
    this.render();
  }

  render() {
    if (this.state.childObjs.length === 0) {
      this.html`
        ${StateTree._style()}
        <span class="details__key key--primitive">${this.state.name}</span>
        <span class="${StateTree.primitiveClass(this.state.values.newState)}">${String(this.state.values.newState)}</span>
        ${this.state.compute ? ComputeListing.makeOrUpdate(null, this.state.compute) : null}
      `;
    } else {
      this.html`
        ${StateTree._style()}
        <details class="details">
          <summary class="details__summary">
            <span class="details__key">${this.state.name}</span>
            ${this.state.compute ? ComputeListing.makeOrUpdate(null, this.state.compute) : null}
          </summary>
          ${this.state.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
            ${new StateTree(new StateTree.Props(key, value), {
              class: 'details__value'
            })}
          `)}
        </details>
      `;
    }
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
          display: block;
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

StateTree.Props = class {
  /**
   * @param {string[]} path the path as array of strings
   */
  constructor(name, data) {
    this.childObjs = !data || !data.children ? [] : Object.entries(data.children);
    // this.rawChildren = data.children;
    if (!data)
      return;
    this.name = name;
    this.compute = data.compute;
    this.values = data.values;
  }

  static update(newProps, oldProps) {
    return newProps;
  }
};

export default StateTree;

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