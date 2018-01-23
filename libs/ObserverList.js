import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {ObserveFunction} from "./ObserveFunction.js";

export class ObserverList extends HyperHTMLElement {

  /**
   * update a computed trigger
   * @param {HyperHTMLElement} el
   * @param {Object} observerInfo
   */
  static makeOrUpdate(el, observerInfo, selected) {
    el = el || new ObserverList(true);
    el.updateState(observerInfo, selected);
    return el;
  }

  /**
   * An entry for a computed trigger
   */
  constructor(skipRender) {
    super();
    // this.attachShadow({mode: 'open'});
    if (!skipRender)
      this.render();
  }

  updateState(observerInfo, selected) {
    this.state.observers = observerInfo ? Object.values(observerInfo) : undefined;
    this.state.selected = selected;
    this.render();
  }

  render() {
    if (!this.state.observers)
      return this.html`<h5>No observers registered</h5>`;

    return this.html`
      <style>${ObserverList._style(this.state.selected)}</style>
      <h4 class="observer__header">Observers</h4>
      <ul class="observer__observers">
        ${this.state.observers.map(observer => HyperHTMLElement.wire()`
          ${ObserveFunction.makeOrUpdate(null, observer)}
        `)}
      </ul>
    `;
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