/** @module DetailedObject */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

/**
 * Webcomponent tree view of an object
 * @export
 * @class DetailedObject
 * @extends {HyperHTMLElement}
 */
export class DetailedObject extends HyperHTMLElement {
  
  /**
   * Creates an instance of DetailedObject
   * @param {Object} props
   * @param {string} props.name
   * @param {Object} props.obj Properties of class
   * @param {Object} attribs HTML attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    props = Object.assign({}, DetailedObject.initProps, props);
    this.updateProps(props);
  }

  /**
   * Returns default props
   * @readonly
   * @static
   */
  static get initProps() {
    return {
      name: 'unset',
      obj: null
    };
  }

  /**
   * Updates props and rerenders component
   * @param {Object} props
   * @param {string} props.name
   * @param {Object} props.obj Properties of class
   */
  updateProps(props) {
    props = Object.assign({}, this._props, props);
    props.childObjs = !props.obj || typeof props.obj !== "object" ? [] : Object.entries(props.obj);
    this._props = props;

    this.render();
  }

  /**
   * Renders html to the shadow dom of a component
   */
  render() {
    if (this._props.childObjs.length === 0) {
      this.html `
        <style>
          span.valueNew {
            color: pink;
          }
        </style>
        <span class="stateName">${this._props.name}</span> : 
        <span class="valueNew">${this._props.obj}</span>
      `;
    } else {
      this.html `
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
            ${new DetailedObject({
              name: key,
              obj: value
            })}
          `)}
        </details>
      `;
    }
  }
}

customElements.define("detailed-object", DetailedObject);