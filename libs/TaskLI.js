const taskTemplate = document.createElement("li");
taskTemplate.innerHTML = `
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
    <pre class="eventInput"></pre>
    <div class="computes"></div>
    <div class="observes"></div>
  </div>`;

const funcTemplate = document.createElement("li");
funcTemplate.innerHTML = `
  <span class="returnProp"></span>
  <span class="pointsTo functionSign"></span>
  <span class="funcName"></span>
  <span class="pointsTo argsStart"></span>
  <span class="funcArgs"></span>
  <span class="pointsTo argsEnd"></span>
`;

class TaskLI {

  static makeTaskLI(debugInfo, id) {
    let task = debugInfo.task;
    let li = taskTemplate.cloneNode(true);
    li.id = "task_" + id;
    li.dataset.index = id;
    li.addEventListener('click', TaskLI.toggleListItem);
    li.querySelector("span.eventType").innerText = task.eventType;
    li.querySelector("span.taskName").innerText = task.taskName;
    li.querySelector("span.added").innerText = TaskLI.makeAddedTime(task.added);
    li.querySelector("span.duration").innerText = Math.round((task.stop - task.start) * 100) / 100;
    li.querySelector("pre.eventInput").innerText = JSON.stringify(task.eventInput, null, 2);
    li.querySelector("div.computes").append(TaskLI.makeFuncUL(debugInfo.computerInfo, true));
    li.querySelector("div.observes").append(TaskLI.makeFuncUL(debugInfo.observerInfo, false));
    return li;
  }

  static makeFuncUL(filter, isCompute) {
    let ul = document.createElement("ul");
    ul.classList.add("listOfFuncs");
    for (let funcName in filter) {
      const data = filter[funcName];
      const li = funcTemplate.cloneNode(true);
      li.querySelector("span.returnProp").innerText = isCompute ? data.a.returnProp : "";
      li.querySelector("span.functionSign").innerText = isCompute ? "<=" : "=>";
      li.querySelector("span.funcName").innerText = data.a.funcName;

      const args = li.querySelector("span.funcArgs");
      for (let i = 0; i < data.triggerPaths.length; i++) {
        let p = data.triggerPaths[i];
        if (i !== 0)
          args.append(TaskLI.makeSpan(", ", "pointsTo"));
        let arg = TaskLI.makeSpan(p.path.join("."), "funcArgPath");
        if (p.triggered)
          arg.classList.add("triggered");
        args.append(arg);
      }

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


  static makeSpan(innerText, clazz) {
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
    const stateItem = document.querySelector("#s" + taskItem.dataset.index + "_state");
    stateItem.classList.add('opened');
  }
}