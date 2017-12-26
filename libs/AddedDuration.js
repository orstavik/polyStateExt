/** @module libs/AddedDuration */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

/**
 * Webcomponent time info of task
 */
class AddedDuration extends HyperHTMLElement {

  /**
   * Creates an instance of AddedDuration
   * @param {AddedDuration.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this._props = props;
    this.cachedStyle = this._style();
    this.updateProps();
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {AddedDuration.Props} props New properties of class
   */
  updateProps(props) {
    this._props = this._props.update(props);
    const t = new Date(this._props.timestamp);
    this._props.h = AddedDuration.formatNumber(t.getHours(), 2);
    this._props.m = AddedDuration.formatNumber(t.getMinutes(), 2);
    this._props.s = AddedDuration.formatNumber(t.getSeconds(), 2);
    this._props.ms = AddedDuration.formatNumber(t.getMilliseconds(), 3);
    this._props.duration = Math.round((this._props.stop - this._props.start) * 100) / 100;
    this.render();
  }
  
  /**
   * Call this method to update the html code inside this element to the current state of its properties and attributes.
   * updateProps calls this method by default, but you must call this method manually if you need the DOM to reflect
   * changes to some of its attributes that should change the HTML structure.
   */
  render() {
    this.html`
      <style>${this.cachedStyle}</style>
      <span class="task__timestamp">${this._props.h}:${this._props.m}:${this._props.s}.${this._props.ms}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${this._props.duration}</span>
    `;
  }
  
  /**
   * Helper function to isolate css style
   * @return {HTMLStyleElement}
   */
  _style() {
    return `
      :host {
        display: inline-block;
        color: var(--color-dark-2);
      }
    `;
  }

  /**
   * Formats the number to string with zeros in front
   * so that result contains set number of symbols
   * @param {number} n
   * @param {number} width Number of symbols in result string
   * @returns {string}
   */
  static formatNumber(n, width) {
    return '0'.repeat(width - n.toString().length) + n;
  }
}

/**
 * AddedDuration props interface
 */
AddedDuration.Props = class {
  /**
   * @param {number} props.timestamp
   * @param {number} props.start
   * @param {number} props.stop
   */
  constructor(timestamp, start, stop) {
    this.timestamp = timestamp || 0;
    this.start = start || 0;
    this.stop = stop || 0;
  }

  /**
   * @param {Object} newProps
   * @param {} newProps.timestamp
   * @param {} newProps.start
   * @param {} newProps.stop
   */
  update(newProps){
    return Object.assign({}, this, newProps);
  }
};

customElements.define('added-duration', AddedDuration);

export default AddedDuration;