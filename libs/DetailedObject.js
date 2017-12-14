import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class DetailedObject extends HyperHTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setObj("unset", null);
  }

  setObj(name, obj) {
    this.name = name;
    this.obj = obj;
    this.childObjs = DetailedObject.getChildren(obj);
  }

  updateObject(name, obj) {
    this.setObj(name, obj);
    this.render();
    if (this.childObjs.length > 0) {
      let childrenDO = this.shadowRoot.querySelectorAll("detailed-object");
      for (let i = 0; i < this.childObjs.length; i++) {
        let childObj = this.childObjs[i];
        childrenDO[i].updateObject(childObj[0], childObj[1]);
      }
    }
  }

  render() {
    if (this.childObjs.length === 0) {
      this.html`
        <style>
          span {
            color: orange;
          }
        </style>
        <span class="stateName">${this.name}</span> : 
        <span class="valueNew">${this.obj}</span>
      `;
    } else {
      this.html`
        <details>
          <summary>
            <span class="stateName">${this.name}</span>
          </summary>
          <ul>
            ${this.childObjs.map(child => HyperHTMLElement.wire()`
              <li>
                <detailed-object class="${child[0]}">${child[1]}</detailed-object>
              </li>
            `)}
          </ul>                                                           
        </details>
      `;
    }
  }

  static getChildren(obj) {
    return !obj || typeof obj !== "object" ? [] : Object.entries(obj);
  }
}

DetailedObject.define('detailed-object');