import {html,render} from "../node_modules/lit-html/lit-html.js";

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

  static template(id, index, method, timestamp, duration) {
    return html`
  <details class="task__body" id="${id}" data-index="${index}">
    <summary class="task__summary">
      <span class="task__method">${method}</span>
      <span class="task__timestamp">${timestamp}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${duration}</span>
    </summary>
    <ul class="task__event"></ul>
  </details>`;
  }

  static makeTaskLI(debugInfo, id) {
    const li = document.createElement("li");
    li.classList.add("task");
    const task = debugInfo.task;

    const taskId = "task_" + id;
    const timestamp = TaskLI.makeAddedTime(task.added);
    const duration = Math.round((task.stop - task.start) * 100) / 100;
    const frag = TaskLI.template(taskId, id, task.taskName, timestamp, duration);
    render(frag, li);

    const ul = li.querySelector("ul.task__event");
    ul.append(TaskLI.makeEventTreeLI("detail", task.event.detail));
    ul.append(TaskLI.makeEventTreeLI("type", task.event.type));
    li.addEventListener('mousedown', TaskLI.showActiveState);
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

  static makeAddedTime(timestamp, start, stop) {
    const t = new Date(timestamp);
    let h = t.getHours();
    h = '0'.repeat(2 - h.toString().length) + h;
    let m = t.getMinutes();
    m = '0'.repeat(2 - m.toString().length) + m;
    let s = t.getSeconds();
    s = '0'.repeat(2 - s.toString().length) + s;
    let ms = t.getMilliseconds();
    ms = '0'.repeat(3 - ms.toString().length) + ms;
    return `${h}:${m}:${s}.${ms}`;
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