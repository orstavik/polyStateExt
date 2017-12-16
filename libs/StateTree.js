import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ComputeListing} from "./ComputeListing.js";

export class StateTree extends HyperHTMLElement {

  static make(name, obj, clazz) {
    const res = new StateTree();
    res.updateObject(name, obj);
    res.classList.add(clazz);
    return res;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setObj("unset", null);
  }

  setObj(name, data) {
    this.childObjs = !data || !data.children ? [] : Object.entries(data.children);
    // this.rawChildren = data.children;
    if (!data)
      return;
    this.compute = data.compute;
    this.name = name;
    this.values = data.values;
    this.styles = data.style;
  }

  updateObject(name, obj) {
    this.setObj(name, obj);
    this.render();
  }

  render() {
    if (this.childObjs.length === 0) {
      this.html`
        <style>
          span.valueNew {
            color: pink;
          }
        </style>
        ${this.compute ? new ComputeListing(this.compute) : ""}
        <span class="stateName">${this.name}</span> : 
        <span class="valueNew">${this.values.newState}</span>
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
            ${this.compute ? new ComputeListing(this.compute) : ""}
            <span class="stateName">${this.name}</span>
          </summary>
          ${this.childObjs.map(child => HyperHTMLElement.wire()`
            ${StateTree.make(child[0], child[1])}
          `)}
        </details>
      `;
    }
  }

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
}

customElements.define("state-tree", StateTree);