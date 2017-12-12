const taskTemplate = document.createElement("li");
taskTemplate.innerHTML =
  `<div class="listItem">
  <div class="openArrow"></div>
  <div class="eventMethod">
    <span class="taskName"></span>
  </div>
  <div class="timings">
    <span class="added"></span>
  </div>
</div>
<div class="compObs">
  <ul class="content eventInput"></ul>
</div>`;

class TaskLI {

  static makeTaskLI(debugInfo, id) {
    let task = debugInfo.task;
    let li = taskTemplate.cloneNode(true);
    li.id = "task_" + id;
    li.dataset.index = id;
    li.querySelector("span.taskName").innerText = task.taskName;
    li.querySelector("span.added").innerText = TaskLI.makeAddedTime(task.added, task.start, task.stop);
    li.querySelector("ul.eventInput").append(ObservableStateLI.makeEventTreeLI(task.taskName, task.event));
    li.addEventListener('mousedown', TaskLI.toggleListItem);
    li.querySelector('div.openArrow').addEventListener('mousedown', (e) => {
      e.stopPropagation();
      li.classList.toggle('opened')
    });
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
    let d = Math.round((stop - start) * 100) / 100;
    return `${h}:${m}:${s}.${ms} | ${d}`;
  }

  static toggleListItem(e) {

    const otherOpenedState = document.querySelectorAll("#stateDetails>ul>li.active");
    for (let active of otherOpenedState)
      active.classList.remove("active");

    const otherOpenedTask = document.querySelectorAll("#taskList>ul>li.active");
    for (let active of otherOpenedTask)
      active.classList.remove("active");

    const taskItem = e.currentTarget;
    taskItem.classList.add("active");
    const stateItem = document.querySelector("#s" + taskItem.dataset.index);
    stateItem.classList.add("active");
  }
}