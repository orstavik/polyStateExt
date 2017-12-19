import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class StatePath extends HyperHTMLElement {

  /**
   * Creates an instance of StateDetail
   */
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
    this.addEventListener("click", StatePath.togglePathArgs);
  }

  render() {
    this.html`
      <style>
        :host {
          color: darkgreen;
        }
        :host([triggered="true"])  {
          font-weight: bold;
        }
      </style>
      <slot></slot>
    `;
  }

  static togglePathArgs(e) {
    let content = this.shadowRoot.querySelector("slot").assignedNodes()[0];
    this.dispatchEvent(new CustomEvent("path-clicked", {composed: true, bubbles: true, detail: content}));
  }
}

customElements.define('state-path', StatePath);