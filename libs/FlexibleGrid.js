/** @module libs/FlexibleGrid */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class FlexibleGrid extends HyperHTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.separator = this.getAttribute('separator') || `${window.innerWidth/2}px`;
    this.minCols = this.getAttribute('min-cols').split(' ') || [`${window.innerWidth/2}px`, `${window.innerWidth/2}px`];
    this.direction = this.getAttribute('direction') || 'horizontal';
    this.cachedStyle = this._style();
    this.render();
    this.setDraggableSeparator();
  }

  static _gridStyle(dir, sep) {
    if (dir === 'horizontal')
      return `grid-template-columns: ${sep} auto`;
    else if (dir === 'vertical')
      return `grid-template-rows: ${sep} auto`;
  }

  static _colsStyle(dir, sep) {
    if (dir === 'horizontal')
      return `left: ${sep}`;
    else if (dir === 'vertical')
      return `top: ${sep}`;
  }

  static _getSeparator(e, dir, minCols) {
    let diff;
    if (dir === 'horizontal')
      diff = e.x;
    else if (dir === 'vertical')
      diff = e.y

    const minOne = minCols[0].match(/\d+/)[0];
    const minTwo = minCols[1].match(/\d+/)[0];

    if (diff < minOne) {
      return minOne;
    } else if (dir === 'horizontal') {
      if (diff > (window.innerWidth-minTwo))
        return window.innerWidth-minTwo;
      else return diff;
    } else if (dir === 'vertical') {
      if (diff > (window.innerHeight-minTwo))
        return window.innerHeight-minTwo;
      else return diff;
    }
  }

  setDraggableSeparator() {
    const separator = this.shadowRoot.querySelector('.grid__separator');
    const grid = this.shadowRoot.querySelector('.grid');
    const downCallback = function(e) {
      if (e.which === 1) {
        window.addEventListener('mousemove', moveCallback);
        window.addEventListener('mouseup', upCallback);
        grid.classList.add('grid--dragged');
      }
    }.bind(this);
    const moveCallback = function(e) {
      e.preventDefault();
      this.separator = `${FlexibleGrid._getSeparator(e, this.direction, this.minCols)}px`;
      this.render();
    }.bind(this);
    const upCallback = function(e) {
      window.removeEventListener('mousemove', moveCallback);
      window.removeEventListener('mouseup', upCallback);
      grid.classList.remove('grid--dragged');
    }.bind(this);
    separator.addEventListener('mousedown', downCallback);
  }

  render() {
    return this.html`
      <style>
        ${this.cachedStyle}
      </style>
      <div class="grid" style="${FlexibleGrid._gridStyle(this.direction, this.separator)}">
        <slot name="first" class="grid__container"></slot>
        <slot name="second" class="grid__container"></slot>
        <div class="grid__separator" style="${FlexibleGrid._colsStyle(this.direction, this.separator)}"></div>
      </div>
    `;
  }

  _style() {
    return `
      :host {
        display: block;
        position: relative;
        --separator-color: var(--color-border-1);
      }
      .grid {
        display: grid;
        height: 100%;
      }
      :host([direction="horizontal"]) .grid {
        grid-template-columns: ${this.separator} auto;
      }
      :host([direction="vertical"]) .grid {
        grid-template-rows: ${this.separator} auto;
      }
      :host([direction="horizontal"]) .grid__container:first-child::slotted(*) {
        border-right: 1px solid var(--separator-color);
      }
      :host([direction="vertical"]) .grid__container:first-child::slotted(*) {
        border-bottom: 1px solid var(--separator-color);
      }
      .grid__separator {
        display: inline-block;
        position: absolute;
        z-index: 100;
      }
      :host([direction="horizontal"]) .grid__separator {
        width: 6px;
        height: 100%;
        margin-left: -3px;
        left: ${this.separator};
        top: 0;
        cursor: ew-resize;
      }
      :host([direction="vertical"]) .grid__separator {
        width: 100%;
        height: 6px;
        margin-top: -3px;
        left: 0;
        top: ${this.separator};
        cursor: ns-resize;
      }
      :host([direction="horizontal"]) .grid--dragged .grid__separator {
        width: 600px;
        margin-left: -300px;
      }
      :host([direction="vertical"]) .grid--dragged .grid__separator {
        height: 600px;
        margin-top: -300px;
      }
    `;
  }
}

customElements.define("flexible-grid", FlexibleGrid);