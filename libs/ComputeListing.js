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
    this.state = computeObj;
    this.render();
  }

  render() {
    this.html`
      ${ComputeListing._style()}
      <div class="compute">
        <span class="compute__icon" onclick="${this.computeToggle.bind(this)}">&#9881;</span>
        <span class="compute__description compute--hidden">
          <span class="compute__name">${this.state.funcName}</span>
          <span class="compute__args">
            ${(this.state.triggerPaths).map((arg, i) => HyperHTMLElement.wire()`
              ${i !== 0 ? ", " : ""}
              <state-path triggered="${arg.triggered}">${arg.path.join(".")}</state-path>
            `)}
          </span>
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
        .compute__description::before {
          content: '<=';
        }
        .compute--hidden {
          display: none;
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
      </style>
    `;
  }

  computeToggle(e) {
    e.stopPropagation();
    const descr = this.shadowRoot.querySelector('.compute__description');
    descr.classList.toggle('compute--hidden');
  }
}

customElements.define('compute-listing', ComputeListing);