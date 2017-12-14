import {wire,bind} from "../node_modules/hyperhtml/esm/index.js";

const EventDetailLITemplate = document.createElement("li");
EventDetailLITemplate.innerHTML =
  `<div class="propWrapper">
  <span class="stateName"></span>:
  <span class="valueNew"></span>
</div>
<ul></ul>`;

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
    
    </ul>
  </details>
</li>
`;
  }

  static makeTaskLI(task, id) {
    const li = TaskLI.template("task_" + id, id, task, TaskLI.showActiveState);
    const ul = li.querySelector("ul.task__event");
    ul.append(TaskLI.makeEventTreeLI("detail", task.event.detail));
    ul.append(TaskLI.makeEventTreeLI("type", task.event.type));
    return li;
  }

  static makeEventTreeLI(name, obj) {
    const li = EventDetailLITemplate.cloneNode(true);
    li.querySelector("div.propWrapper").addEventListener("click", (e) => li.classList.toggle("opened"));
    li.querySelector("span.stateName").textContent = name;

    if (obj && typeof obj === "object" && Object.keys(obj).length !== 0) {
      li.classList.add("hasChildren");
      const childUL = li.querySelector("ul");
      for (let childName in obj)
        childUL.appendChild(TaskLI.makeEventTreeLI(childName, obj[childName]));
    } else {
      li.querySelector("span.valueNew").textContent = obj;
    }
    return li;
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