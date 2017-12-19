import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class ObserveFunction extends HyperHTMLElement {

  static makeOrUpdate(el, observeFunc){
    el = el || new ObserveFunction(true);
    el.updateState(observeFunc);
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

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {ObserveFunction.Props} props The new properties of this component
   */
  updateState(props) {
    this.state = props;
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
      <span class="funcName">${this.state.funcName}</span>
      <span class="pointsTo argsStart">(</span>
      <span class="funcArgs">
        ${(this.state.triggerPaths || []).map((arg, i) => HyperHTMLElement.wire()`
          ${i !== 0 ? ", " : ""}
          <state-path triggered="${arg.triggered}">${arg.path.join(".")}</state-path>
        `)}
      </span>
      <span class="pointsTo argsEnd">)</span>
    `;
  }
}

customElements.define('observe-function', ObserveFunction);