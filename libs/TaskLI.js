import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";
import {AddedDuration} from "./AddedDuration.js";
import {DetailedObject} from "./DetailedObject.js";

export class TaskLI extends HyperHTMLElement {

  constructor(props, attribs) {
    super();
    this.attachShadow({mode: 'open'});

    for (let key in attribs)
      this.setAttribute(key, attribs[key]);
    
    props = Object.assign({
      index: 0,
      task: {
        taskName: 'unset',
      }
    }, props);
    
    this.updateProps(props);
    this.addEventListener("mousedown", TaskLI.showActiveState);
  }

  updateProps(props) {
    props = Object.assign({}, this._props, props);
    this._props = props;

    this.render();
  }

  render() {
    return this.html`
      <details class="task__body" data-index="${this._props.index}">
        <summary class="task__summary">
          <span class="task__method">${this._props.task.taskName}</span>
          ${new AddedDuration({
            timestamp: this._props.task.added,
            start: this._props.task.start,
            stop: this._props.task.stop
          }, {
            class: 'task__timestamp',
            'data-test': 'test'
          })}
        </summary>
        ${new DetailedObject({
          name: this._props.task.taskName,
          obj: this._props.task.event
        })}
      </details>
    `;
  }

  static showActiveState(e) {
    const prevTask = document.querySelector('.task--active');
    if (prevTask)
      prevTask.classList.remove("task--active");
    const nextTask = e.currentTarget;
    nextTask.classList.add("task--active");

    const otherOpenedState = document.querySelectorAll("#stateDetails>ul>li.active");
    for (let active of otherOpenedState)
      active.classList.remove("active");
    const stateItem = document.querySelector("#s" + nextTask.dataset.index);
    stateItem.classList.add("active");
  }
}

customElements.define('task-li', TaskLI);