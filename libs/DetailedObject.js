import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class DetailedObject extends HyperHTMLElement {

  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});

    for (let key in attribs)
      this.setAttribute(key, attribs[key]);

    props = Object.assign({
      name: 'unset',
      obj: null
    }, props);

    this.updateProps(props);
  }

  updateProps(props) {
    props = Object.assign({}, this._props, props);
    props.childObjs = !props.obj || typeof props.obj !== "object" ? [] : Object.entries(props.obj);
    this._props = props;

    this.render();
  }

  render() {
    if (this._props.childObjs.length === 0) {
      this.html `
        <style>
          span.valueNew {
            color: pink;
          }
        </style>
        <span class="stateName">${this._props.name}</span> : 
        <span class="valueNew">${this._props.obj}</span>
      `;
    } else {
      this.html `
        <style>
          details {
            padding-left: 15px; 
          }
        </style>
        <details>
          <summary>
            <span class="stateName">${this._props.name}</span>
          </summary>
          ${this._props.childObjs.map(([key, value]) => HyperHTMLElement.wire()`
            ${new DetailedObject({
              name: key,
              obj: value
            })}
          `)}
        </details>
      `;
    }
  }
}

customElements.define("detailed-object", DetailedObject);