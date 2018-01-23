import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {PathValue} from "./PathValue.js";

export class StateDetail extends HyperHTMLElement {

  /**
   * StateDetail
   */
  constructor() {
    super();
    this.state.cache = {};
    this.attachShadow({mode: 'open'});
  }

  render(fullTree, todoAddStylesHereToo) {
    const elements = [];
    for (let path in fullTree) {
      const element = this.state.cache[path] || (this.state.cache[path] = new PathValue());
      elements.push(element);
      element.render(fullTree[path]);
    }
    //todo addStyle
    // <input type="checkbox" id="stateChangeView" onclick="${this.toggleStateChange.bind(this)}">
    // <label for="stateChangeView">Show state changes</label><br />
    this.html`
      <style>
      div {
        display: inline-block;
      }
      path-value {
        display: none;
      }
      path-value[parentReduced],
      path-value[parentComputed],
      path-value[reduced],
      path-value[computed]{
        display: block;
      }
      path-value[reduced][computed] {
        display: block;
        color: red;
      }
      div.reduced, div.start {
        display:none;
      }
      div.computed {
        width: 20ch;
        height: 1em;
        overflow: hidden;
      }
      </style>
      <h4 class="state__header">State</h4>
      ${elements}`;
  }

  static _treeStyle() {
    //language=CSS
    return `
        :host {
            display: block;
            padding: 12px 24px;
        }
        .state__header {
            margin: 0 0 12px;
        }
        .statetree {
            display: block;
            font-family: Consolas, "dejavu sans mono", monospace;
            line-height: 16px;
            white-space: nowrap;
        }
        .statetree > .statetree__subtree {
            display: block;
        }
        .statetree__subtree {
            display: none;
            /*display: block;*/
            padding-left: 13.5px;
        }
        .statetree__opener::before {
            content: "\\25b6";
            width: 14px;
            font-size: 10px;
            color: var(--color-dark-3);
            padding: 4px 0 4px;
            margin-right: -2px;
            pointer-events: auto;
        }
        .statetree--opened .statetree__opener::before,
        .statetree > .statetree__opener::before {
            content: "\\25bc";
            font-size: 13px;
            padding: 4px 2px 4px 0;
        }
        .statetree__key {
            color: var(--color-property-normal);
        }
        .statetree__key::after {
            content: ':';
        }
        .statetree__oldvalue {
            display: none;
        }
        .statetree__oldvalue > .statetree__value {
            text-decoration: line-through;
        }
        :host(.statetree--changes) .statetree__oldvalue {
            display: inline;
        }
        .key--primitive {
            padding-left: 13.5px;
        }
        .primitive--type-undefined,
        .primitive--type-null {
            color: var(--color-nothing-normal);
        }
        .primitive--type-boolean {
            color: var(--color-boolean-normal);
        }
        .primitive--type-number {
            color: var(--color-number-normal);
        }
        .primitive--type-string {
            color: var(--color-string-normal);
        }
        .primitive--type-string::before,
        .primitive--type-string::after {
            content: '"';
        }
    `;
  }

  toggleStateChange(e) {
    this.classList.toggle("statetree--changes");
  }

}

customElements.define("state-detail", StateDetail);