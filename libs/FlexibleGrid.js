/** @module libs/FlexibleGrid */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import draggable from "./draggable.js";
import throttle from "./throttle.js";

class FlexibleGrid extends HyperHTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.getAttributes()
    this.cachedStyle = this._style();
    this.render();
    this.setDraggableSeparator();
  }

  getAttributes() {
    this.separator = this.getAttribute('separator') || `${window.innerWidth/2}px`;
    this.minCols = this.getAttribute('min-cols').split(' ') || [`${window.innerWidth/2}px`, `${window.innerWidth/2}px`];
    this._parseDirection();
  }

  _parseDirection() {
    let attr = this.getAttribute('direction-media');
    if (attr) {
      attr = attr.split(' ');
      this._mediaWidth = attr[1].match(/\d+/)[0];
      this._directionBig = attr[0];
      this._directionSmall = attr[2];
      if (window.innerWidth > this._mediaWidth) {
        this.direction = this._directionBig;
        this.setAttribute('direction', this.direction)
      } else {
        this.direction = this._directionSmall;
        this.setAttribute('direction', this.direction)
      }
      if (this._mediaWidth) {
        this._addResizeListener();
      }
    }
  }

  _addResizeListener() {
    window.addEventListener('resize', () => {
      throttle(() => {
        if (window.innerWidth > this._mediaWidth && this.direction !== this._directionBig) {
          this.direction = this._directionBig;
          this.setAttribute('direction', this.direction);
          this.render();
        } else if (window.innerWidth <= this._mediaWidth && this.direction !== this._directionSmall) {
          this.direction = this._directionSmall;
          this.setAttribute('direction', this.direction);
          this.render();
        }
      }, 1000/30);
    })
  }

  static _gridStyle(dir, sep, mCols) {
    if (dir === 'horizontal')
      return `grid-template-columns: ${sep} auto`;
      // return `grid-template-columns: minmax(${mCols[0]}, ${sep}) minmax(${mCols[1]}, auto)`;
    else if (dir === 'vertical')
      return `grid-template-rows: ${sep} auto`;
      // return `grid-template-rows: minmax(${mCols[0]}, ${sep}) minmax(${mCols[1]}, auto)`;
  }

  static _colsStyle(dir, sep, mCols) {
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
    draggable(separator);
    separator.addEventListener('draggingstart', (e) => {
      grid.classList.add('grid--dragged');
    });
    separator.addEventListener('dragging', (e) => {
      this.separator = `${FlexibleGrid._getSeparator(e.detail, this.direction, this.minCols)}px`;
      this.render();
    });
    separator.addEventListener('draggingend', (e) => {
      grid.classList.remove('grid--dragged');
    });
  }

  render() {
    return this.html`
      <style>
        ${this.cachedStyle}
      </style>
      <div class="grid" style="${FlexibleGrid._gridStyle(this.direction, this.separator, this.minCols)}">
        <slot name="first" class="grid__container"></slot>
        <slot name="second" class="grid__container"></slot>
        <div class="grid__separator" style="${FlexibleGrid._colsStyle(this.direction, this.separator, this.minCols)}"></div>
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