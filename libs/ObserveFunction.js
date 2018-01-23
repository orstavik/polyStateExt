import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class ObserveFunction extends HyperHTMLElement {

  /**
   * This function is both for creating new DOM node and for updating and rerendering content of existing DOM nodes.
   * @param {HyperHTMLElement} el The existing element to be updated and rerendered, undefined to create a new element.
   * @param {Object} observeFunc The observer function description
   * @returns {HyperHTMLElement} el The existing element updated or the new element created.
   */
  static makeOrUpdate(el, observeFunc) {
    el = el || new ObserveFunction(true);
    el.render(observeFunc);
    return el;
  }

  /**
   * Creates an instance of a observer function description
   * @param {boolean} skipRender
   */
  constructor(skipRender) {
    super();
    this.cachedStyle = ObserveFunction._style();
    // this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
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