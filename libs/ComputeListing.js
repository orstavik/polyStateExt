import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class ComputeListing extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} computeObj
   */
  static makeOrUpdate(el, computeObj) {
    el = el || new ComputeListing(true);
    el.updateState(computeObj);
    return el;
  }

  static get defaultState(){
    return {
      triggerReturn: {},
      funcName: "unset",
      triggerPaths: []
    }
  }

  /**
   * An entry for a computed trigger
   */
  constructor(skipRender) {
    super();
    this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
  }

  updateState(computeObj) {
    this.state.func = computeObj;
    this.render();
  }

  render() {
    this.html`
      ${ComputeListing._style()}
      <div class="compute">
        <span class="compute__icon" onclick="${this.computeToggle.bind(this)}">&#9881;</span>
        <span class="compute__description">
          <span class="compute__name">${this.state.func.funcName}</span>
          <span class="compute__args">
            ${(this.state.func.argsPaths || []).map(arg => HyperHTMLElement.wire()`
              <state-path path="${arg}">${arg}</state-path>
            `)}
          </span>
        </span>
      </div>
    `;
  }                       //triggered="${arg.triggered}" selected="${arg.selected}"

  static _style() {
    return HyperHTMLElement.wire()`
      <style>
        :host {
          display: inline-block;
        }
        .compute__description {
          display: none;
        }
        .compute:hover .compute__description {
          display: inline-block;
        }
        .compute__description::before {
          content: '<=';
        }
        .compute__name {
          color: orange;
        }
        .compute__args::before {
          content: '(';
        }
        .compute__args::after {
          content: ')';
        }
        state-path:not(:last-child)::after {
          content: ', ';
        }        
      </style>
    `;
  }

  computeToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("path-clicked", {composed: true, bubbles:true, detail: this.state.func.triggerReturn.path.join(".")}));
  }
}

customElements.define('compute-listing', ComputeListing);