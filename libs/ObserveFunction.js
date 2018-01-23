import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class ObserveFunction extends HyperHTMLElement {

  /**
   * Creates an instance of a observer function description
   * @param observeFunc
   */
  constructor(observeFunc) {
    super();
    this.cachedStyle = ObserveFunction._style();
    this.render(observeFunc);
  }

  render(observeFunc) {
    this.html`
      <style>${this.cachedStyle}</style>
      <span class="funcName">${observeFunc.funcName}</span>
      <span class="funcArgs">
        ${(observeFunc.argsPaths || []).map(arg => HyperHTMLElement.wire()`
          <state-path path="${arg}">${arg}</state-path>
        `)}
      </span>
    `;
  }

  static _style(){
    //language=CSS
    return `
        observe-function {
          display: block;
        }
        span.funcName {
          color: lightgreen;
        }
        .funcArgs::before {
          content: "("
        }
        .funcArgs::after {
          content: ")"
        }
        state-path:not(:last-child)::after{
          content: ", "
        }
    `;
  }
}

customElements.define('observe-function', ObserveFunction);