import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class StatePath extends HyperHTMLElement {

  static make(path) {
    const res = new StatePath();
    res.updatePath(path);
    return res;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setPathObj(null);
    this.addEventListener("click", StatePath.togglePathArgs);
  }

  setPathObj(path) {
    this.contentValue = path ? path.path.join(".") : "unset";
    this.classes = path && path.triggered ? "triggered" : "";
  }

  updatePath(path) {
    this.setPathObj(path);
    this.render();
  }

  render() {
    console.log("statepath");
    this.html`
      <style>
        span {
          color: darkgreen;
        }
      </style>
      <span class="${this.classes}" onclick="${StatePath.togglePathArgs}">${this.contentValue}</span>
    `;
  }

  static togglePathArgs(e) {
    this.dispatchEvent(new CustomEvent("path-clicked", {composed: true, bubbles: true, detail: this.contentValue}));
  }
}

customElements.define('state-path', StatePath);