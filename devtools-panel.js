const StatePrinter =
  `
class StatePrinter {

  static parse(debugInfo){
    return {
      task: debugInfo.task,
      visualVersion: StatePrinter.compareObjects("state", debugInfo.startState, debugInfo.reducedState, debugInfo.newState),
      computerInfo: StatePrinter.debug(debugInfo.computerInfo.start, debugInfo.computerInfo.stop),
      observerInfo: StatePrinter.debug(debugInfo.observerInfo.start, debugInfo.observerInfo.stop)
    };
  }
  
  static debug(aFuncReg, bFuncReg) {
    let C = {};
    for (let key in aFuncReg) {
      let A = aFuncReg[key];
      let B = bFuncReg[key];
      if (A === B)
        continue;
      let triggerPaths = [];
      for (let i = 0; i < B.argsValue.length; i++) {
        let a = A.argsValue[i];
        let b = B.argsValue[i];
        let triggered = false;
        if (a !== b)
          triggered = true;
        triggerPaths[i] = {path: A.argsPaths[i], triggered: triggered};
      }
      C[key] = {a: A, triggerPaths: triggerPaths};
    }
    return C;
  }

  //.name, .diff, .style, .values.startState/.reducedState/.newState, .children
  static compareObjects(name, startState, reducedState, newState) {
    let res = {};
    res.name = name;
    res.style = [
      "reduce" + StatePrinter.diff(startState, reducedState),
      "compute" + StatePrinter.diff(reducedState, newState)
    ];
    res.values = {
      startState: StatePrinter.getPrintValue(startState),
      reducedState: StatePrinter.getPrintValue(reducedState),
      newState: StatePrinter.getPrintValue(newState)
    };
    res.children = {};

    for (let prop of StatePrinter.getAllObjectKeys(newState, reducedState, startState)) {
      let start = startState ? startState[prop] : undefined;
      let reduced = reducedState ? reducedState[prop] : undefined;
      let nevv = newState ? newState[prop] : undefined;
      res.children[prop] = StatePrinter.compareObjects(prop, start, reduced, nevv);
    }
    return res;
  }

  static getAllObjectKeys(computedState, reducedState, startState) {
    let allKeys = [];
    if (computedState && typeof computedState === "object")
      allKeys = Object.keys(computedState);
    if (reducedState && typeof reducedState === "object")
      for (let key in reducedState)
        if (allKeys.indexOf(key) === -1)
          allKeys.push(key);
    if (startState && typeof startState === "object")
      for (let key in startState)
        if (allKeys.indexOf(key) === -1)
          allKeys.push(key);
    return allKeys;
  }

  static getPrintValue(obj) {
    if (!obj)
      return obj;
    if (typeof obj === "object")
      return "";
    return obj;
  }

  static diff(a, b) {
    if (a === b) return "NoChange";
    if (a === undefined) return "Added";
    if (b === undefined) return "Deleted";
    return "Altered";
  }
}
`;

let cb = `
ITObservableState.debugHook = function(snap){
  let res = StatePrinter.parse(snap); 
  console.log("hooked: ", res); 
  Tools.emit('state-changed-debug', JSON.stringify(res));
};
`;

chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  filename: "content-script.js"
});

chrome.devtools.inspectedWindow.eval(StatePrinter + cb);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.name === 'new-client-state') {
    let debugInfo = JSON.parse(request.payload);
    let id = debugCounter++;
    const li = makeTaskLI(debugInfo, id);
    taskListUL.appendChild(li);
    const state = ObservableStateLI.makeStateTreeUL(debugInfo.visualVersion, id + "_state");
    stateListUL.append(state);
  }
});

let debugCounter = 1;
const taskListUL = document.querySelector("#taskList>ul");
const stateListUL = document.querySelector("#stateDetails>ul");

const makeFuncUL = function (filter, isCompute) {
  let str = "";
  for (let funcName in filter) {
    let data = filter[funcName];
    let spannedArgs = data.triggerPaths.map(p =>
      `<span class='funcArgPath ${p.triggered ? "triggered" : ""}'>${p.path.join(".")}</span>`
    );
    let args = spannedArgs.join(", ");
    let returnValue = isCompute ?
      `<span class="returnProp">${data.a.returnProp}</span><span class="pointsTo"> = </span>` :
      "<span class='observeEntry'> => </span>";
    let li = `
<li>
  ${returnValue}
  <span class="funcName">${data.a.funcName}</span>
  <span class="pointsTo">(</span>${args}<span class="pointsTo">)</span>
</li>`;
    str += li;
  }
  return "<ul class='listOfFuncs'>" + str + "</ul>";
};

function makeAddedTime(timestamp) {
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

function makeTaskLI(debugInfo, id) {
  let task = debugInfo.task;
  let visualVersion = debugInfo.visualVersion;
  // let stateTreeUL = makeStateTreeUL(visualVersion);
  let addedDate = makeAddedTime(task.added);
  let timeToCompute = Math.round((task.stop - task.start) * 100) / 100;
  let computeBody = makeFuncUL(debugInfo.computerInfo, true);
  let observeBody = makeFuncUL(debugInfo.observerInfo, false);
  let li = document.createElement("li");
  li.id = "task_" + id;
  li.dataset.index = id;
  li.innerHTML =
    `
<div>
<div class="eventMethod">
  <span class="eventType">${task.eventType}</span><br>
  <span>&#10551;</span>
  <span class="taskName">${task.taskName}</span>
</div>
<div class="timings">
  <span class="added">${addedDate}</span>
  <span class="duration">${timeToCompute}</span>
</div>
</div>
<div class="compObs">
  <div class="computes">${computeBody}</div>
  <div class="observes">${observeBody}</div>
</div>`;
  return li;
}

function toggleListItem(e) {
  // li.addEventListener('click', toggleListItem);
  const item = e.currentTarget;
  if (item.classList.contains('opened'))
    return item.classList.remove('opened');
  item.classList.add('opened');
  details.innerHTML = `<ul class="stateTree">${stateList[item.dataset.index]}</ul>`;
}