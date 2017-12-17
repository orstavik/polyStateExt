/** @module AddedDuration */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

/**
 * Webcomponent time info of task
 * @export
 * @class AddedDuration
 * @extends {HyperHTMLElement}
 */
export class AddedDuration extends HyperHTMLElement {

  /**
   * Creates an instance of AddedDuration
   * @param {Object} props
   * @param {number} props.timestamp
   * @param {number} props.start
   * @param {number} props.stop Properties of class
   * @param {Object} attribs HTML attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    props = Object.assign({}, AddedDuration.initProps, props);
    this.updateProps(props);
  }

  /**
   * Returns default props
   * @readonly
   * @static
   */
  static get initProps() {
    return {
      timestamp: 0,
      start: 0,
      stop: 0
    }
  }

  /**
   * Updates props and rerenders component
   * @param {Object} props
   * @param {number} props.timestamp
   * @param {number} props.start
   * @param {number} props.stop Properties of class
   */
  updateProps(props) {
    props = Object.assign({}, this._props, props);
    const t = new Date(props.timestamp);
    props.h = AddedDuration.formatNumber(t.getHours(), 2);
    props.m = AddedDuration.formatNumber(t.getMinutes(), 2);
    props.s = AddedDuration.formatNumber(t.getSeconds(), 2);
    props.ms = AddedDuration.formatNumber(t.getMilliseconds(), 3);
    props.duration = Math.round((props.stop - props.start) * 100) / 100;
    this._props = props;
    
    this.render();
  }
  
  /**
   * Renders html to the shadow dom of a component
   */
  render() {
    this.html`
      ${AddedDuration.style()}
      <span class="task__timestamp">${this._props.h}:${this._props.m}:${this._props.s}.${this._props.ms}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${this._props.duration}</span>
    `;
  }
  
  /**
   * Returns style html element
   * @return {HTMLStyleElement}
   */
  static style() {
    return HyperHTMLElement.wire()`
      <style>
        :host {
          --color: grey;
          color: --color;
        }
      </style>
    `;
  }

  /**
   * Formats the number to string with zeros in front
   * so that result contains set number of symbols
   * @static
   * @param {number} n
   * @param {number} width Number of symbols in result string
   * @returns {string}
   */
  static formatNumber(n, width) {
    return '0'.repeat(width - n.toString().length) + n;
  }
}

customElements.define('added-duration', AddedDuration);