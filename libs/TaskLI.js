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
   */
  constructor(props) {
    super();
    this.attachShadow({mode: 'open'});
    this.setAttribute("id", 'task_' + props.index);
    this.setAttribute("data-index", props.index);
    this.classList.add('tasklist__item');
    this.classList.add('task');
    this.cachedStyle = this._style();
    this.render(props);
    this.addEventListener('mousedown', TaskLI.showActiveState);
  }

  /**
   * Call this method to update the html code inside this element to the current state of its properties and attributes.
   * updateProps calls this method by default, but you must call this method manually if you need the DOM to reflect
   * changes to some of its attributes that should change the HTML structure.
   */
  render(p) {
    return this.html`
      <style>${this.cachedStyle}</style>
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
   */
  _style() {
    return `
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
        color: var(--color-dark-3);
        padding: 4px 0 4px 4px;
        pointer-events: auto;
      }
      
      .task__body[open] .task__summary::before {
        content: "\\25bc";
      }
      
      .task__summary:focus {
        outline: none;
      }

      .task__summary {
        background-color: var(--color-light-0);
      }
      
      :host(.task:nth-child(2n)) .task__summary {
        background-color: var(--color-accent-light);
      }
      
      :host(.task--active) .task__summary,
      :host(.task--active) .task__summary::before {
        background-color: var(--color-accent-dark) !important;
        color: var(--color-light-0);
      }

      :host(.task--active) .task__timestamp {
        color: var(--color-light-0);
      }
      
      .task__method {
        flex: 1;
      }

      .task__details {
        padding: 10px;
        border-top: 1px solid var(--color-border-4);
        border-bottom: 1px solid var(--color-border-4);
        overflow-x: auto;
      }
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

    this.dispatchEvent(new CustomEvent("task-selected", {
      composed: true,
      bubbles: true,
      detail: nextTask.dataset.index
    }));
  }
}

customElements.define('task-li', TaskLI);

export default TaskLI;