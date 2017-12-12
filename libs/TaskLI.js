class TaskLI {

  static makeTaskLI(debugInfo, id) {
    let task = debugInfo.task;
    let li = taskTemplate.cloneNode(true);
    li.id = "task_" + id;
    li.dataset.index = id;
    li.querySelector("span.eventType").innerText = task.eventType;
    li.querySelector("span.taskName").innerText = task.taskName;
    li.querySelector("span.added").innerText = TaskLI.makeAddedTime(task.added);
    // li.querySelector("span.duration").innerText = Math.round((task.stop - task.start) * 100) / 100;
    li.querySelector("ul.eventInput").append(ObservableStateLI.makeEventTreeLI("e.detail", task.eventInput));
    for (let funcName in debugInfo.computerInfo)
      li.querySelector("div.computes>ul").append(TaskLI.makeFuncUL(debugInfo.computerInfo[funcName], true));
    for (let funcName in debugInfo.observerInfo)
      li.querySelector("div.observes>ul").append(TaskLI.makeFuncUL(debugInfo.observerInfo[funcName], false));
    li.addEventListener('mousedown', TaskLI.toggleListItem);
    li.querySelector('div.openArrow').addEventListener('mousedown', (e) => {
      e.stopPropagation();
      li.classList.toggle('opened')
    });
    return li;
  }

  static makeFuncUL(data, isCompute) {
    const li = funcTemplate.cloneNode(true);
    if (isCompute)
      li.querySelector("span.returnProp").append(TaskLI.makeArgsPath({path: [data.a.returnProp], triggered: true}));
    //todo add so that triggered is not always true for the returnProp.. need to do this in the actual functions register somehow
    li.querySelector("span.funcName").innerText = data.a.funcName;
    const args = li.querySelector("span.funcArgs");
    for (let i = 0; i < data.triggerPaths.length; i++) {
      if (i !== 0) args.append(TaskLI.makeSpan(", ", "pointsTo"));
      args.append(TaskLI.makeArgsPath(data.triggerPaths[i]));
    }
    return li;
  };

  static makeArgsPath(path) {
    const span = pathTemplate.cloneNode(true);
    span.textContent = path.path.join(".");
    if (path.triggered)
      span.classList.add("triggered");
    span.addEventListener("click", TaskLI.togglePathArgs);
    return span;
  }

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

  static togglePathArgs(e) {
    const oldFlash = document.querySelectorAll(".flash");
    for (let oldi of oldFlash)
      oldi.classList.remove("flash");

    const index = e.path[6].dataset.index;
    let segments = e.currentTarget.textContent.split(".");

    for (let i = 0; i < segments.length; i++) {
      let partialPath = segments.slice(0, segments.length - i);
      let argPath = partialPath.join("_");
      let detail = document.querySelector("#s" + index + "_state_" + argPath);
      detail.classList.add("opened");
    }

    let argPath = segments.join("_");
    let detail = document.querySelector("#s" + index + "_state_" + argPath);
    detail.classList.add("flash");
    detail.scrollIntoViewIfNeeded();
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
    const stateItem = document.querySelector("#s" + taskItem.dataset.index + "_state");
    stateItem.classList.add("active");
  }
}

const taskTemplate = document.createElement("li");
taskTemplate.innerHTML =
`<div class="listItem">
  <div class="openArrow"></div>
  <div class="eventMethod">
    <span class="eventType"></span><br>
    <span class="taskName"></span>
  </div>
  <div class="timings">
    <span class="added"></span>
  </div>
</div>
<div class="compObs">
  <div class="label">Event Detail</div>
  <ul class="content eventInput"></ul>
  <div class="label">Computeds</div>
  <div class="content computes">
    <ul class="listOfFuncs"></ul>
  </div>
  <div class="label">Observers</div>
  <div class="content observes">
    <ul class="listOfFuncs"></ul>
  </div>
  <div class="label endLine"></div>
</div>`;

const funcTemplate = document.createElement("li");
funcTemplate.innerHTML =
  `<span class="returnProp"></span>
<span class="pointsTo functionSign"> = </span>
<span class="funcName"></span>
<span class="pointsTo argsStart">(</span>
<span class="funcArgs"></span>
<span class="pointsTo argsEnd">)</span>`;

const pathTemplate = document.createElement("span");
pathTemplate.classList.add("funcArgPath");

