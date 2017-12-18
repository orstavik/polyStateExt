import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class ObserveFunction extends HyperHTMLElement {

  /**
   * Creates an instance of a observer function description
   * @param {ObserveFunction.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this.state = props;
    this.render();
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {ObserveFunction.Props} props The new properties of this component
   */
  updateProps(props) {
    this.state = ObserveFunction.Props.update(props, this.state);
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
        ${(this.state.funcArgs || []).map((arg, i) => HyperHTMLElement.wire()`
          ${i !== 0 ? ", " : ""}
          <state-path triggered="${arg.triggered}">${arg.path.join(".")}</state-path>
        `)}
      </span>
      <span class="pointsTo argsEnd">)</span>
    `;
  }
}

ObserveFunction.Props = class {
  /**
   * @param {{funcName: string, triggerPaths: []}} functionObj representing the function being called
   */
  constructor(functionObj) {
    this.funcName = functionObj ? functionObj.funcName : "unset";
    this.funcArgs = functionObj ? functionObj.triggerPaths : [];
  }

  static update(newProps, oldProps) {
    return newProps;
  }
};

export default ObserveFunction;

customElements.define('observe-function', ObserveFunction);