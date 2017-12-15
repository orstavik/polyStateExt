import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class DetailedObject extends HyperHTMLElement {

  static make(name, obj) {
    const res = new DetailedObject();
    res.updateObject(name, obj);
    return res;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setObj("unset", null);
  }

  setObj(name, obj) {
    this.name = name;
    this.obj = obj;
    this.childObjs = !obj || typeof obj !== "object" ? [] : Object.entries(obj);
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
        <span class="stateName">${this.name}</span> : 
        <span class="valueNew">${this.obj}</span>
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
            <span class="stateName">${this.name}</span>
          </summary>
          ${this.childObjs.map(child => HyperHTMLElement.wire()`
            ${DetailedObject.make(child[0],child[1])}
          `)}
        </details>
      `;
    }
  }
}

customElements.define("detailed-object", DetailedObject);