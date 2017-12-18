import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import ComputeListing from "./ComputeListing.js";

class StateTree extends HyperHTMLElement {

  /**
   * Creates an instance of StateDetail
   * @param {StateTree.Props} props Properties of class
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
   * @param {StateTree.Props} props The new properties of this component
   */
  updateProps(props) {
    this.state = StateTree.Props.update(props, this.state);
    this.render();
  }

  render() {
    if (this.state.childObjs.length === 0) {
      this.html`
        <style>
          span.valueNew {
            color: pink;
          }
        </style>
        ${this.state.compute ? new ComputeListing(new ComputeListing.Props(this.state.compute), null) : ""}
        <span class="stateName">${this.state.name}</span> : 
        <span class="valueNew">${this.state.values.newState}</span>
      `;
    } else {
      this.html`
        <style>
          details {
            padding-left: 15px; 
          }
        </style>
        <details>
          <summary>
            ${this.state.compute ? new ComputeListing(this.state.compute, null) : ""}
            <span class="stateName">${this.state.name}</span>
          </summary>
          ${this.state.childObjs.map(child => HyperHTMLElement.wire()`
            ${new StateTree(new StateTree.Props(child[0], child[1]), null)}
          `)}
        </details>
      `;
    }
  }
}

StateTree.Props = class {
  /**
   * @param {string[]} path the path as array of strings
   */
  constructor(name, data) {
    this.childObjs = !data || !data.children ? [] : Object.entries(data.children);
    // this.rawChildren = data.children;
    if (!data)
      return;
    this.name = name;
    this.compute = data.compute;
    this.values = data.values;
  }

  static update(newProps, oldProps) {
    return newProps;
  }
};

export default StateTree;

customElements.define("state-tree", StateTree);

// flashPath(segments) {
//   let first = segments.shift();
//   this.name === first ? this.classList.add("flash") : this.classList.remove("flash");
//   if (segments.length === 0)
//     this.scrollIntoViewIfNeeded();
//   else{
//     if (this.rawChildren[segments[0]])
//       this.shadowRoot.querySelectorAll("state-detail").map(child => child.flashPath(segments));
//     else
//       alert("This part of your path is not to be found: " + segments.join("."));
//   }
// }