import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class ObserveFunction extends HyperHTMLElement {

  static make(funcObj) {
    const res = new ObserveFunction();
    res.updateFuncObj(funcObj);
    return res;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setFuncObj(null);
  }

  setFuncObj(functionObj) {
    this.funcName = functionObj ? functionObj.funcName : "unset";
    this.funcArgs = functionObj ? functionObj.triggerPaths : [];
  }

  updateFuncObj(funcObj) {
    this.setFuncObj(funcObj);
    this.render();
  }

  render() {
    this.html`
      <style>
        :host {
          display: block;
        }
        span.funcName {
          color: lightgreen;
        }
      </style>
      <span class="funcName">${this.funcName}</span>
      <span class="pointsTo argsStart">(</span>
      <span class="funcArgs">
        ${this.funcArgs.map((arg, i) => HyperHTMLElement.wire()`
          ${i !== 0 ? ", " : ""}
          <state-path triggered="${arg.triggered}">${arg.path.join(".")}</state-path>
        `)}
      </span>
      <span class="pointsTo argsEnd">)</span>
    `;
  }
}

customElements.define('observe-function', ObserveFunction);