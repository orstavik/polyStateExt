import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StatePath} from "./StatePath.js";

export class ComputeListing extends HyperHTMLElement {

  /**
   * An entry for a computed trigger
   * @param {Object} props
   * @param {Object} props.triggerReturn
   * @param {String} props.funcName
   * @param {Object[]} props.triggerPaths
   * @param {Object} attribs
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});

    for (let key in attribs)
      this.setAttribute(key, attribs[key]);

    props = Object.assign({}, props);

    this.updateProps(props);
  }

  /**
   * update a computed trigger
   * @param {Object} props
   * @param {Object} props.triggerReturn
   * @param {String} props.funcName
   * @param {Object[]} props.triggerPaths
   */
  updateProps(props) {
    props = Object.assign({}, this._props, props);
    this._props = props;
    this.render();
  }

  render() {
    this.html`
      <style>
        span.compute__name {
          color: orange;
        }
      </style>
  
      <div class="compute">
        <span class="compute__icon">&#9881;</span>
        <span class="compute__description">
          <span class="compute__return">${StatePath.make(this._props.triggerReturn, this._props.triggerReturn.triggered)}</span> = 
          <span class="compute__name">${this._props.funcName}</span>(<span class="compute__args">
          ${(this._props.triggerPaths || []).map((arg, i) =>
            HyperHTMLElement.wire()`${i !== 0 ? ", " : ""}${StatePath.make(arg, arg.triggered)}`
          )}
          </span>)
        </span>
      </div>
    `;
  }
}

customElements.define('compute-listing', ComputeListing);