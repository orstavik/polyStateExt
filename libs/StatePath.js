import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class StatePath extends HyperHTMLElement {

  /**
   * Creates an instance of StatePath
   */
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
    this.addEventListener("click", this.togglePathArgs.bind(this));
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
        :host([selected="true"])  {
          text-decoration: underline;
        }
      </style>
      <slot></slot>
    `;
  }

  togglePathArgs(e) {
    let content = this.shadowRoot.querySelector("slot").assignedNodes()[0].nodeValue;
    this.dispatchEvent(new CustomEvent("path-clicked", {composed: true, bubbles: true, detail: content}));
  }
}

customElements.define('state-path', StatePath);