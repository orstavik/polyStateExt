/** @module libs/TaskLI */

import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import AddedDuration from "./AddedDuration.js";
import DetailedObject from "./DetailedObject.js";

/**
 * Webcomponent state task view
 */
class TaskLI extends HyperHTMLElement {
  /**
   * Creates an instance of TaskLI
   * @param {TaskLI.Props} props Properties of class
   * @param {Object} attribs Attributes of component
   */
  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});
    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    this._props = props;
    this.updateProps();
    this.addEventListener('mousedown', TaskLI.showActiveState);
  }

  /**
   * Call this method to update its properties and rerender its DOM node.
   * @param {TaskLI.Props} props The new properties of this component
   */
  updateProps(props) {
    this._props = this._props.update(props);
    this.render();
  }

  /**
   * Call this method to update the html code inside this element to the current state of its properties and attributes.
   * updateProps calls this method by default, but you must call this method manually if you need the DOM to reflect
   * changes to some of its attributes that should change the HTML structure.
   */
  render() {
    const p = this._props;
    return this.html`
      ${TaskLI._style()}
      <details class="task__body" data-index="${p.index}">
        <summary class="task__summary">
          <span class="task__method">${p.task.taskName}</span>
          ${new AddedDuration(new AddedDuration.Props(p.task.added, p.task.start, p.task.stop), {
            class: 'task__timestamp',
            'data-test': 'test'
          })}
        </summary>
        <div class="task__details">
          ${new DetailedObject(new DetailedObject.Props(p.task.taskName, p.task.event))}
        </div>
      </details>
    `;
  }

  /**
   * Helper function to isolate css style
   * @returns {HTMLStyleElement}
   */
  static _style() {
    return HyperHTMLElement.wire()`
      <style>
        :host {
          display: block;
        }
        .task__summary {
          display: flex;
          align-items: center;
          line-height: 16px;
          padding: 8px 8px 8px 4px;
          pointer-events: none;
        }
        
        .task__summary::-webkit-details-marker {
          display: none;
        }
        
        .task__summary::before {
          content: "\\25b6";
          display: inline-block;
          width: 14px;
          font-size: 10px;
          padding: 4px 0 4px 4px;
          pointer-events: auto;
          cursor: pointer;
        }
        
        .task__body[open] .task__summary::before {
          content: "\\25bc";
        }
        
        .task__summary:focus {
          outline: none;
        }
        
        :host(.task:nth-child(2n)) .task__summary {
          background-color: #f5f5f5;
        }
        
        :host(.task--active) .task__summary {
          background-color: #3879d9 !important;
          color: white;
        }

        :host(.task--active) .task__timestamp {
          color: white;
        }
        
        .task__method {
          flex: 1;
        }

        .task__details {
          padding: 10px;
          border-bottom: 1px solid #dadada;
          overflow-x: auto;
        }
      </style>
    `;
  }

  /**
   * Changes the current active task and state detail
   * @param {MouseEvent} e
   */
  static showActiveState(e) {
    const prevTask = document.querySelector('.task--active');
    if (prevTask) {
      prevTask.classList.remove("task--active");
    }
    const nextTask = e.currentTarget;
    nextTask.classList.add("task--active");

    this.dispatchEvent(new CustomEvent("task-selected", {composed:true, bubbles:true, detail: nextTask.dataset.index}));
  }
}

/**
 * TaskLI props interface
 */
TaskLI.Props = class {
  /**
   * @param {number} index Index of task
   * @param {Object} task Body of task
   */
  constructor(index, task) {
    this.index = index || 0;
    this.task = task || {taskName: "unset"};
  }

  /**
   * @param {Object} newProps
   * @param {number} newProps.index
   * @param {Object} newProps.task
   */
  update(newProps){
    return Object.assign({}, this, newProps);
  }
};

customElements.define('task-li', TaskLI);

export default TaskLI;