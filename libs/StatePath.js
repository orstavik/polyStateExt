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
    // this.addEventListener("click", StatePath.togglePathArgs);
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
    const oldFlash = document.querySelectorAll(".flash");
    for (let oldi of oldFlash)
      oldi.classList.remove("flash");

    const index = e.path[5].contentID;
    let segments = e.currentTarget.textContent.split(".");

    for (let i = 0; i < segments.length; i++) {
      let partialPath = segments.slice(0, segments.length - i);
      let argPath = partialPath.join("_");
      let detail = document.querySelector("#" + index + "_state_" + argPath);
      detail.classList.add("opened");
    }

    let argPath = segments.join("_");
    let detail = document.querySelector("#s" + index + "_state_" + argPath);
    detail.classList.add("flash");
    detail.scrollIntoViewIfNeeded();
  }
}

customElements.define('state-path', StatePath);