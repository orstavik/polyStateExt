import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class AddedDuration extends HyperHTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setTimes(0, 0, 0);
  }

  setTimes(timestamp, start, stop) {
    const t = new Date(timestamp);
    this.h = AddedDuration.formatNumber(t.getHours(), 2);
    this.m = AddedDuration.formatNumber(t.getMinutes(), 2);
    this.s = AddedDuration.formatNumber(t.getSeconds(), 2);
    this.ms = AddedDuration.formatNumber(t.getMilliseconds(), 3);
    this.duration = Math.round((stop - start) * 100) / 100;
  }

  updateTimes(timestamp, start, stop) {
    this.setTimes(timestamp, start, stop);
    this.render();
  }

  render() {
    this.html`
      <style>
        span {
          color: blue;
        }
      </style>
      <span class="task__timestamp">${this.h}:${this.m}:${this.s}.${this.ms}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${this.duration}</span>
    `;
  }

  static formatNumber(n, width) {
    return '0'.repeat(width - n.toString().length) + n;
  }
}
customElements.define('added-duration', AddedDuration);