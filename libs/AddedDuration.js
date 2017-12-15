import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class AddedDuration extends HyperHTMLElement {

  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});

    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    
    props = Object.assign({
      timestamp: 0,
      start: 0,
      stop: 0
    }, props);
    
    this.updateProps(props);
  }

  // props = {timestamp: <Number>, start: <Number>, stop: <Number>}
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

  render() {
    this.html`
      ${AddedDuration.style()}
      <span class="task__timestamp">${this._props.h}:${this._props.m}:${this._props.s}.${this._props.ms}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${this._props.duration}</span>
    `;
  }
  
  static style() {
    return HyperHTMLElement.wire()`
      <style>
        :host {
          color: grey;
        }
        :host(.task--active) {
          color: white;
        }
      </style>
    `;
  }

  static formatNumber(n, width) {
    return '0'.repeat(width - n.toString().length) + n;
  }
}
customElements.define('added-duration', AddedDuration);