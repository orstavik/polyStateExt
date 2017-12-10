class TaskLI {

  static makeTaskLI(debugInfo, id) {
    let task = debugInfo.task;
    let li = document.createElement("li");
    li.id = "task_" + id;
    li.dataset.index = id;
    li.addEventListener('click', TaskLI.toggleListItem);
    li.innerHTML = `
<div class="eventMethod">
  <span class="eventType"></span><br>
  <span>&#10551;</span>
  <span class="taskName"></span>
</div>
<div class="timings">
  <span class="added"></span>
  <span class="duration"></span>
</div>
</div>
<div class="compObs">
  <div class="computes"></div>
  <div class="observes"></div>
</div>`;
    li.querySelector("span.eventType").innerText = task.eventType;
    li.querySelector("span.taskName").innerText = task.taskName;
    li.querySelector("span.added").innerText = TaskLI.makeAddedTime(task.added);
    li.querySelector("span.duration").innerText = Math.round((task.stop - task.start) * 100) / 100;
    li.querySelector("div.computes").append(TaskLI.makeFuncUL(debugInfo.computerInfo, true));
    li.querySelector("div.observes").append(TaskLI.makeFuncUL(debugInfo.observerInfo, false));
    return li;
  }

  static makeFuncUL (filter, isCompute) {
    let ul = document.createElement("ul");
    ul.classList.add("listOfFuncs");
    for (let funcName in filter) {
      let data = filter[funcName];
      let li = document.createElement("li");
      li.append(TaskLI.makeSpan(isCompute ? data.a.returnProp : "", "returnProp"));
      li.append(TaskLI.makeSpan(isCompute ? "<=" : "=>", "pointsTo"));
      li.append(TaskLI.makeSpan(data.a.funcName, "funcName"));
      li.append(TaskLI.makeSpan("(", "pointsTo"));

      let comma = false;
      for (let p of data.triggerPaths) {
        if (comma)
          li.append(",", "pointsTo");
        else
          comma = true;
        li.append(p.path.join("."), "funcArgPath" + p.triggered ? " triggered" : "");
      }

      li.append(TaskLI.makeSpan(")", "pointsTo"));
      ul.append(li);
    }
    return ul;
  };

  static makeAddedTime(timestamp) {
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


  static makeSpan(innerText, clazz){
    const span = document.createElement("span");
    span.classList.add(clazz);
    span.innerText = innerText;
    return span;
  }

  static toggleListItem(e) {

    const otherOpenedState = document.querySelectorAll("#stateDetails>ul>li.opened");
    for (let opened of otherOpenedState)
      opened.classList.remove("opened");

    const otherOpenedTask = document.querySelectorAll("#taskList>ul>li.opened");
    for (let opened of otherOpenedTask)
      opened.classList.remove("opened");

    const taskItem = e.currentTarget;
    taskItem.classList.add('opened');
    const stateItem = document.querySelector("#s" + taskItem.dataset.index +"_state");
    stateItem.classList.add('opened');
  }
}