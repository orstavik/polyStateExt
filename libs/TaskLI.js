class TaskLI {

  static makeTaskLI(debugInfo, id) {
    let task = debugInfo.task;
    let li = document.createElement("li");
    li.id = "task_" + id;
    li.dataset.index = id;
    li.addEventListener('click', TaskLI.toggleListItem);
    li.innerHTML =
      `
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
    li.querySelector("div.eventMethod>span.eventType").innerText = task.eventType;
    li.querySelector("div.eventMethod>span.taskName").innerText = task.taskName;
    li.querySelector("div.timings>span.added").innerText = TaskLI.makeAddedTime(task.added);
    li.querySelector("div.timings>span.duration").innerText = Math.round((task.stop - task.start) * 100) / 100;
    li.querySelector("div.compObs>div.computes").append(TaskLI.makeFuncUL(debugInfo.computerInfo, true));
    li.querySelector("div.compObs>div.observes").append(TaskLI.makeFuncUL(debugInfo.observerInfo, false));
    return li;
  }

  static makeFuncUL (filter, isCompute) {
    let ul = document.createElement("ul");
    ul.classList.add("listOfFuncs");
    let str = "";
    for (let funcName in filter) {
      let data = filter[funcName];
      let liEl = document.createElement("li");
      let spannedArgs = data.triggerPaths.map(p =>
        `<span class='funcArgPath ${p.triggered ? "triggered" : ""}'>${p.path.join(".")}</span>`
      );
      let args = spannedArgs.join(", ");
      let returnValue = isCompute ?
        `<span class="returnProp">${data.a.returnProp}</span><span class="pointsTo"> = </span>` :
        "<span class='observeEntry'> => </span>";
      liEl.innerHTML = `
<li>
  ${returnValue}
  <span class="funcName">${data.a.funcName}</span>
  <span class="pointsTo">(</span>${args}<span class="pointsTo">)</span>
</li>`;
      ul.append(liEl);
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