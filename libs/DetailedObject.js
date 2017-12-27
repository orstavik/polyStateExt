/** @module libs/DetailedObject */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

/**
 * Webcomponent tree view of an object
 */
class DetailedObject extends HyperHTMLElement {
  
  /**
   * Creates an instance of DetailedObject
   * @param {DetailedObject.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this._props = props;
    this.cachedStyle = this._style();
    this.updateProps(props);
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {DetailedObject.Props} props New properties of class
   */
  updateProps(props) {
    this._props = this._props.update(props);
    this._props.childObjs = !this._props.obj || typeof this._props.obj !== "object" ? [] : Object.entries(this._props.obj);
    this.render();
  }

  /**
   * Call this method to update the html code inside this element to the current state of its properties and attributes.
   * updateProps calls this method by default, but you must call this method manually if you need the DOM to reflect
   * changes to some of its attributes that should change the HTML structure.
   */
  render() {
    if (this._props.childObjs.length === 0) {
      this.html`
        <style>${this.cachedStyle}</style>
        <span class="details__key key--primitive">${this._props.name}</span>
        <span class="${DetailedObject.primitiveClass(this._props.obj)}">${String(this._props.obj)}</span>
      `;
    } else {
      this.html`
        <style>${this.cachedStyle}</style>
        <details class="details">
          <summary class="details__summary">
            <span class="details__key">${this._props.name}</span>
          </summary>
          ${this._props.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
            ${new DetailedObject(new DetailedObject.Props(key, value), {
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
  _style() {
    return `
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
        color: var(--color-dark-3);
      }
    `;
  }

  static primitiveClass(value) {
    const type = (value === undefined || value === null) ? String(value) : (value.constructor.name).toLowerCase();
    return `details__value primitive--type-${type}`;
  }
}

/**
 * DetailedObject props interface
 */
DetailedObject.Props = class {
  /**
   * @param {string} name Name of object
   * @param {Object} obj Body of object
   */
  constructor(name, obj) {
    this.name = name || 'unset';
    this.obj = obj || null;
  }

  /**
   * @param {Object} newProps
   * @param {string} newProps.name
   * @param {Object} newProps.obj
   */
  update(newProps){
    return Object.assign({}, this, newProps);
  }
};

customElements.define("detailed-object", DetailedObject);

export default DetailedObject;