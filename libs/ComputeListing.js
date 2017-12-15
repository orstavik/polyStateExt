import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StatePath} from "./StatePath.js";

class ComputeListing extends HyperHTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setFuncObj(null);
    // this.addEventListener("click", e => {
    //   this.classList.toggle("compute--active");
    //   e.stopPropagation();
    // });
  }

  setFuncObj(functionObj) {
    this.funcReturn = functionObj ? functionObj.triggerReturn : null;
    this.funcName = functionObj ? functionObj.funcName : "unset";
    this.funcArgs = functionObj ? functionObj.triggerPaths : [];
  }

  updateFuncObj(funcObj) {
    this.setFuncObj(funcObj);
    this.render();
  }

  render() {
    console.log("statepath");
    this.html`
      <style>
        span.compute__name {
          color: orange;
        }
      </style>
  
      <div class="compute">
        <span class="compute__icon">&#9881;</span>
        <span class="compute__description">
          <span class="compute__return">${StatePath.make(this.funcReturn)}</span> = 
          <span class="compute__name">${this.funcName}</span>(<span class="compute__args">
          ${this.funcArgs.map((arg, i) =>
            HyperHTMLElement.wire()`${i !== 0 ? ", ": ""}${StatePath.make(arg)}`
          )}
          </span>)
        </span>
      </div>
    `;
  }
}
AddedDuration.define('compute-listing', ComputeListing);