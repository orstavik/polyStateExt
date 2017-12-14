import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class ObserveFunction extends HyperHTMLElement {

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
    let statePaths = this.shadowRoot.querySelectorAll("state-path");
    for (let i = 0; i < this.funcArgs.length; i++) {
      statePaths[i].updatePath(this.funcArgs[i]);
    }
  }

  render() {
    console.log("statepath");
    this.html`
      <style>
        span.funcName {
          color: lightgreen;
        }
      </style>
      <span class="funcName">${this.funcName}</span>
      <span class="pointsTo argsStart">(</span>
      <span class="funcArgs">
      ${this.funcArgs.map((arg, i) =>
        HyperHTMLElement.wire()`${i !== 0 ? ", ": ""}<state-path></state-path>`
      )}
      </span>
      <span class="pointsTo argsEnd">)</span>
    `;
  }
}

ObserveFunction.define('observe-function');