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
    el._updateState(observeFunc);
    return el;
  }

  /**
   * Creates an instance of a observer function description
   * @param {boolean} skipRender
   */
  constructor(skipRender) {
    super();
    this.cachedStyle = this._style();
    // this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
  }

  _updateState(observeFunc) {
    if (observeFunc === this.state.func) //todo implies immutable observeFunc
      return;
    this.state.func = observeFunc;
    this.render();
  }

  render() {

    this.html`
      <style>${this.cachedStyle}</style>
      <span class="funcName">${this.state.func.funcName}</span>
      <span class="funcArgs">
        ${(Object.values(this.state.func.triggerPaths) || []).map((arg, i) => HyperHTMLElement.wire(arg)`
          <state-path path="${arg.path.join(".")}" triggered="${arg.triggered}">${arg.path.join(".")}</state-path>
        `)}
      </span>
    `;
  }

  _style(){
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