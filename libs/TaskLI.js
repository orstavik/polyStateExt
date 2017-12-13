// const taskTemplate = document.createElement('li');
// taskTemplate.classList.add('task');
// taskTemplate.innerHTML =
// `<details class="task__body">
//   <summary class="task__summary">
//     <span class="task__method"></span>
//     <span class="task__timestamp"></span>
//     <span>&nbsp;|&nbsp;</span>
//     <span class="task__duration"></span>
//   </summary>
//   <ul class="task__event"></ul>
// </details>`;

class TaskLI {

  static get ACTIVE_CLASS() {
    return 'task--active';
  }

  static template(id, index, method, timestamp, duration) {
    return html`<li class="task">
  <details class="task__body" id="${id}" data-index="${index}">
    <summary class="task__summary">
      <span class="task__method">${method}</span>
      <span class="task__timestamp">${timestamp}</span>
      <span>&nbsp;|&nbsp;</span>
      <span class="task__duration">${duration}</span>
    </summary>
    <ul class="task__event"></ul>
  </details>
</li>`;
  }

  static makeTaskLI(debugInfo, id) {
    const task = debugInfo.task;
    // const li = taskTemplate.cloneNode(true);
    // li.id = "task_" + id;
    // li.dataset.index = id;
    // li.querySelector("span.task__method").textContent = task.taskName;
    // li.querySelector("span.task__timestamp").textContent = TaskLI.makeAddedTime(task.added);
    // li.querySelector("span.task__duration").textContent = Math.round((task.stop - task.start) * 100) / 100;

    const taskId = "task_" + id;
    const timestamp = TaskLI.makeAddedTime(task.added);
    const duration = Math.round((task.stop - task.start) * 100) / 100;
    const frag = TaskLI.template(taskId, id, task.taskName, timestamp, duration);
    debugger;
    const ul = frag.querySelector("ul.task__event");
    ul.append(ObservableStateLI.makeEventTreeLI("detail", task.event.detail));
    ul.append(ObservableStateLI.makeEventTreeLI("type", task.event.type));
    frag.querySelector('li.task').addEventListener('mousedown', TaskLI.showActiveState);

    return frag;
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