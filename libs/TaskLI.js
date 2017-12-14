import {wire, bind} from "../node_modules/hyperhtml/esm/index.js";

class EventDetailLI {

  static template(name, value) {
    let contentValue = "";
    let liClass = "eventdetail";
    let children = [];
    if (EventDetailLI.isIterable(value)){
      liClass += " hasChildren";
      children = Object.entries(value);
    } else {
      contentValue = value;
    }
    return wire()`
<li class="${liClass}">
  <details>
    <summary>
      <span class="stateName">${name}</span>:
      <span class="valueNew">${contentValue}</span>
    </summary>
    <ul>${children.map(entry => EventDetailLI.makeEventTreeLI(entry[0], entry[1]))}</ul>                                                           
  </details>
</li>
`;
  }

  static makeEventTreeLI(name, obj) {
    return EventDetailLI.template(name, obj);
  }

  static isIterable(obj) {
    return obj && typeof obj === "object" && Object.keys(obj).length !== 0;
  }
}

export const TaskLI = class TaskLI {

  static get ACTIVE_CLASS() {
    return 'task--active';
  }

  static timeTemplate(timestamp, start, stop) {
    const t = new Date(timestamp);
    let h = TaskLI.formatNumber(t.getHours(), 2);
    let m = TaskLI.formatNumber(t.getMinutes(), 2);
    let s = TaskLI.formatNumber(t.getSeconds(), 2);
    let ms = TaskLI.formatNumber(t.getMilliseconds(), 3);
    let duration = Math.round((stop - start) * 100) / 100;
    return wire()`
      <span class="task__timestamp">${h}:${m}:${s}.${ms}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${duration}</span>
    `;
  }

  static template(id, index, task, mouseListener) {
    return wire()`
<li id="${id}" class="task" onmousedown="${mouseListener}">
  <details class="task__body" data-index="${index}">
    <summary class="task__summary">
      <span class="task__method">${task.taskName}</span>
      ${TaskLI.timeTemplate(task.added, task.start, task.stop)}
    </summary>
    <ul class="task__event">
      ${EventDetailLI.makeEventTreeLI("detail", task.event.detail)}
      ${EventDetailLI.makeEventTreeLI("type", task.event.type)}
    </ul>
  </details>
</li>
`;
  }

  static makeTaskLI(task, id) {
    return TaskLI.template("task_" + id, id, task, TaskLI.showActiveState);
  }

  static formatNumber(n, width) {
    return '0'.repeat(width - n.toString().length) + n;
  }

  static showActiveState(e) {
    const prevTask = document.querySelector(`.${TaskLI.ACTIVE_CLASS}`);
    if (prevTask)
      prevTask.classList.remove(TaskLI.ACTIVE_CLASS);
    const nextTask = e.currentTarget;
    nextTask.classList.add(TaskLI.ACTIVE_CLASS);

    const otherOpenedState = document.querySelectorAll("#stateDetails>ul>li.active");
    for (let active of otherOpenedState)
      active.classList.remove("active");
    const stateItem = document.querySelector("#s" + nextTask.dataset.index);
    stateItem.classList.add("active");
  }
}