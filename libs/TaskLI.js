import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

class TaskLI extends HyperHTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.setTask(0, {taskName: "unset"});
    this.addEventListener("mousedown", TaskLI.showActiveState);
  }

  setTask(index, task) {
    this.index = index;
    this.contentID = "task_" + index;
    this.taskName = task.taskName;
  }

  updateTask(index, task){
    this.setTask(index, task);
    this.render();
  }

  render() {
    return this.html`
      <li id="${this.contentID}" class="task">
        <details class="task__body" data-index="${this.index}">
          <summary class="task__summary">
            <span class="task__method">${this.taskName}</span>
            <added-duration class="task__time"></added-duration>
          </summary>
          <detailed-object></detailed-object>
        </details>
      </li>
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

TaskLI.define("task-li");