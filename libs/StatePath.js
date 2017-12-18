import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class StatePath extends HyperHTMLElement {

  /**
   * Creates an instance of StateDetail
   * @param {StateDetail.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this.state = props;
    this.render();
    this.addEventListener("click", StatePath.togglePathArgs);
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {StateDetail.Props} props The new properties of this component
   */
  updateProps(props) {
    this.state = StateDetail.Props.update(props, this.state);
    this.render();
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

StatePath.Props = class {
  /**
   * @param {string[]} path the path as array of strings
   */
  constructor(path) {
    this.path = path;
  }

  static update(newProps, oldProps) {
    return newProps;
  }
};

export default StatePath;

customElements.define('state-path', StatePath);