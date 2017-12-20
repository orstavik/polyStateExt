/** @module libs/FlexibleGrid */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class FlexibleGrid extends HyperHTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.separator = this.getAttribute('separator') || `${window.innerWidth/2}px`;
    this.min = this.getAttribute('min') || '300px';
    this.cachedStyle = this._style();
    this.render();
    this.setDraggableSeparator();
  }

  _gridStyle() {
    return `grid-template-columns: ${this.separator} auto`;
  }

  _colsStyle() {
    return `left: ${this.separator}`;
  }

  _normalizeSeparator(x) {
    const min = this.min.match(/\d+/)[0];
    if (x < min)
      return min;
    else if (x > (window.innerWidth-min))
      return window.innerWidth-min;
    else
      return x;
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
      this.separator = `${this._normalizeSeparator(e.x)}px`;
      console.log(this.separator);
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
      <div class="grid" style="${this._gridStyle()}">
        <slot name="first" class="grid__container"></slot>
        <slot name="second" class="grid__container"></slot>
        <div class="grid__separator" style="${this._colsStyle()}"></div>
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
        grid-template-columns: ${this.separator} auto;
      }
      .grid__container:first-child::slotted(*) {
        border-right: 1px solid var(--separator-color);
      }
      .grid__separator {
        display: inline-block;
        height: 100%;
        width: 6px;
        margin-left: -3px;
        position: absolute;
        top: 0;
        left: ${this.separator};
        cursor: ew-resize;
        z-index: 100;
      }
      .grid--dragged .grid__separator {
        width: 600px;
        margin-left: -300px;
      }
    `;
  }
}

customElements.define("flexible-grid", FlexibleGrid);