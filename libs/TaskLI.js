const taskTemplate = document.createElement('li');
taskTemplate.classList.add('tasklist__item');
taskTemplate.innerHTML =
`<details class="task">
  <summary class="task__body">
    <span class="task__method"></span>
    <span class="task__timestamp"></span>
    <span> | </span>
    <span class="task__duration"></span>
  </summary>
  <ul class="task__event"></ul>
</details>`;

class TaskLI {

  static get ACTIVE_CLASS() {
    return 'tasklist--active';
  }

  static makeTaskLI(debugInfo, id) {
    const task = debugInfo.task;
    const li = taskTemplate.cloneNode(true);
    li.id = "task_" + id;
    li.dataset.index = id;
    li.querySelector("span.task__method").textContent = task.taskName;
    li.querySelector("span.task__timestamp").textContent = TaskLI.makeAddedTime(task.added);
    li.querySelector("span.task__duration").textContent = Math.round((task.stop - task.start) * 100) / 100;
    const ul = li.querySelector("ul.task__event");
    ul.append(ObservableStateLI.makeEventTreeLI("detail", task.event.detail));
    ul.append(ObservableStateLI.makeEventTreeLI("type", task.event.type));
    li.addEventListener('mousedown', TaskLI.showActiveState);
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