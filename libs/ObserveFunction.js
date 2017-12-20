import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class ObserveFunction extends HyperHTMLElement {

  /**
   * This function is both for creating new DOM node and for updating and rerendering content of existing DOM nodes.
   * @param {HyperHTMLElement} el The existing element to be updated and rerendered, undefined to create a new element.
   * @param {Object} observeFunc The observer function description
   * @param {String} selectedPath The name of the currently selected path
   * @returns {HyperHTMLElement} el The existing element updated or the new element created.
   */
  static makeOrUpdate(el, observeFunc, selectedPath){
    el = el || new ObserveFunction(true);
    el._updateState(observeFunc, selectedPath);
    return el;
  }

  /**
   * Creates an instance of a observer function description
   * @param {boolean} skipRender
   */
  constructor(skipRender) {
    super();
    this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
  }

  _updateState(observeFunc, selectedPath) {
    if (observeFunc === this.state.func && selectedPath === this.state.selectedPath) //implies immutable observeFunc
      return;
    this.state.func = observeFunc;
    this.state.selectedPath = selectedPath;
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
      <span class="funcName">${this.state.func.funcName}</span>
      <span class="pointsTo argsStart">(</span>
      <span class="funcArgs">
        ${(this.state.func.triggerPaths || []).map((arg, i) => HyperHTMLElement.wire()`
          ${i !== 0 ? ", " : ""}
          <state-path triggered="${arg.triggered}" selected="${arg.path.join(".") === this.state.selectedPath}">${arg.path.join(".")}</state-path>
        `)}
      </span>
      <span class="pointsTo argsEnd">)</span>
    `;
  }
}

customElements.define('observe-function', ObserveFunction);