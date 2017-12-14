import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

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
    let result = this.shadowRoot.querySelector("state-path.result");
    result.updatePath(this.funcReturn);
    let statePaths = this.shadowRoot.querySelectorAll("state-path.arg");
    for (let i = 0; i < this.funcArgs.length; i++) {
      statePaths[i].updatePath(this.funcArgs[i]);
    }
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
          <span class="compute__return"><state-path class="result"></state-path></span> = 
          <span class="compute__name">${this.funcName}</span>(<span class="compute__args">
          ${this.funcArgs.map((arg, i) =>
            HyperHTMLElement.wire()`${i !== 0 ? ", ": ""}<state-path class="arg"></state-path>`
          )}
          </span>)
        </span>
      </div>
    `;
  }
}

ComputeListing.define('compute-listing');