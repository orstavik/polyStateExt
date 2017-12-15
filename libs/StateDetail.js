import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {StateTree} from "./StateTree.js";
import {ObserveFunction} from "./ObserveFunction.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * Adds two numbers
   * @param {Object} props
   * @param {Object} props.debugInfo
   * @param {Object} props.visualVersion
   * @param {Number} props.id
   * @param {Object} attribs
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});

    for (let key in attribs)
      this.setAttribute(key, attribs[key]);

    props = Object.assign({}, props);

    this.updateProps(props);
    this.addEventListener("path-clicked", StateDetail.pathClicked);
  }

  /**
   * Adds two numbers
   * @param {Object} props
   * @param {Object} props.debugInfo
   * @param {Object} props.visualVersion
   * @param {Number} props.id
   */
  updateProps(props) {
    props = Object.assign({}, this._props, props);

    if (!props.debugInfo)
      return;
    props.observers = Object.values(props.debugInfo.observerInfo);

    this._props = props;
    this.render();
  }

  updateDebug(debugInfo, visualVersion, id) {
    this.setDebug(debugInfo, visualVersion, id);
    this.render();
  }

  render() {

    if (this._props.observers.length !== 0) {
      this.html`
        <h4 class="state-observer__header1">Observers</h4>
        <ul class="state-observer__observers">
          ${this._props.observers.map(observer => HyperHTMLElement.wire()`
            ${ObserveFunction.make(observer)}
          `)}
        </ul>
        <h4 class="state-observer__header2">State</h4>
        ${StateTree.make(this._props.id + "_state", this._props.visualVersion)}
      `;
    } else {
      this.html`
        <h5>No observers registered</h5>
      `;
    }
  }

  static pathClicked (e){
    alert("path clicked: " + e.detail);
    if(1)return;
    const oldFlash = document.querySelectorAll(".flash");
    for (let oldi of oldFlash)
      oldi.classList.remove("flash");

    const index = e.path[5].contentID;
    let segments = e.currentTarget.textContent.split(".");

    for (let i = 0; i < segments.length; i++) {
      let partialPath = segments.slice(0, segments.length - i);
      let argPath = partialPath.join("_");
      let detail = document.querySelector("#" + index + "_state_" + argPath);
      detail.classList.add("opened");
    }

    let argPath = segments.join("_");
    let detail = document.querySelector("#s" + index + "_state_" + argPath);
    detail.classList.add("flash");
    detail.scrollIntoViewIfNeeded();
  };
}

customElements.define("state-detail", StateDetail);