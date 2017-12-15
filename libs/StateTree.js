import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ComputeListing} from "./ComputeListing.js";

export class StateTree extends HyperHTMLElement {

  static make(name, obj) {
    const res = new StateTree();
    res.updateObject(name, obj);
    return res;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setObj("unset", null);
  }

  setObj(name, data) {
    this.childObjs = !data || !data.children ? [] : Object.entries(data.children);
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
        ${this.compute ? ComputeListing.make(this.compute) : ""}
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
            ${this.compute ? ComputeListing.make(this.compute) : ""}
            <span class="stateName">${this.name}</span>
          </summary>
          ${this.childObjs.map(child => HyperHTMLElement.wire()`
            ${StateTree.make(child[0],child[1])}
          `)}
        </details>
      `;
    }
  }
}

customElements.define("state-tree", StateTree);