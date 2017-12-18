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
        <style>
          span.valueNew {
            color: pink;
          }
        </style>
        <span class="stateName">${this._props.name}</span> : 
        <span class="valueNew">${this._props.obj}</span>
      `;
    } else {
      this.html`
        <style>
          details {
            padding-left: 15px; 
          }
        </style>
        <details>
          <summary>
            <span class="stateName">${this._props.name}</span>
          </summary>
          ${this._props.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
            ${new DetailedObject(new DetailedObject.Props(key, value))}
          `)}
        </details>
      `;
    }
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