import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ObserveFunction} from "./ObserveFunction.js";

export class ObserverList extends HyperHTMLElement {

  constructor() {
    super();
    this.state.cache = {};
  }

  render(observerInfo, selected) {
    if (!observerInfo)
      return this.html`<h5>No observers registered</h5>`;

    return this.html`
      <style>${ObserverList._style(selected)}</style>
      <h4 class="observer__header">Observers</h4>
      <ul class="observer__observers">
        ${this.makeAndCacheObservers(observerInfo)}
      </ul>
    `;
  }

  makeAndCacheObservers(observerInfo) {
    const observers = [];
    for (let key in observerInfo) {
      if (!this.state.cache[key])
        this.state.cache[key] = new ObserveFunction(observerInfo[key]);
      observers.push(this.state.cache[key]);
    }
    return observers;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  static _style(selected) {
    let selectedSelector = "inactive";
    if (selected && (selected instanceof Object) && Object.keys(selected).length !== 0)
      selectedSelector = `state-path[path="${Object.keys(selected)[0]}"]`;

    // language=CSS
    return `
      :host {
        display: block;
        padding: 12px 24px;
        border-bottom: 1px solid var(--color-border-4);
      }
      .observer__header {
        margin: 0 0 12px;
      }
      .observer__observers {
        padding: 0;
        margin: 0;
      }
      ${selectedSelector} {
        text-decoration: underline;
      }
    `;
  }
}

customElements.define("observer-list", ObserverList);