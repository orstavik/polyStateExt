import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class ComputeListing extends HyperHTMLElement {

  /**
   * An entry for a computed trigger
   * @param {ComputeListing.Props} props Properties of class
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
   * update a computed trigger
   * @param {ComputeListing.Props} props Properties of class
   */
  updateProps(props) {
    props = Object.assign({}, this.state, props);
    this.state = props;
    this.render();
  }

  render() {
    this.html`
      ${ComputeListing._style()}
      <div class="compute">
        <span class="compute__icon">&#9881;</span>
        <span class="compute__description">
          <span class="compute__return">
            <state-path triggered="${this.state.triggerReturn.triggered}">${this.state.triggerReturn.path.join(".")}</state-path>
          </span>
          <=
          <span class="compute__name">${this.state.funcName}</span>(<span class="compute__args">
          ${(this.state.triggerPaths || []).map((arg, i) => HyperHTMLElement.wire()`
            ${i !== 0 ? ", " : ""}
            <state-path triggered="${arg.triggered}">${arg.path.join(".")}</state-path>
          `)}
          </span>)
        </span>
      </div>
    `;
  }

  static _style() {
    return HyperHTMLElement.wire()`
      <style>
        :host {
          display: inline-block;
        }
        .compute__name {
          color: orange;
        }
      </style>
    `;
  }
}

ComputeListing.Props = class {
  /**
   * @param {{triggerReturn: Object, funcName: string, triggerPaths: Object[]}} props the computed function desc
   */
  constructor(props) {
    this.triggerReturn = props ? props.triggerReturn : null;
    this.funcName = props ? props.funcName : "unset";
    this.triggerPaths = props ? props.triggerPaths : [];
  }

  static update(newProps, oldProps) {
    return newProps;
  }
};

export default ComputeListing;

customElements.define('compute-listing', ComputeListing);