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

const taskListUL = document.querySelector("#taskList>ul");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.name === 'new-client-state') {
    const li = makeTaskLI(JSON.parse(request.payload));
    taskListUL.appendChild(li);
  }
});

const makeStateTreeUL = function (visualVersion) {
  let childrenText = "";
  for (let childName in visualVersion.children)
    childrenText += "\n" + makeStateTreeUL(visualVersion.children[childName]);
  let res = `
<li class="${visualVersion.style.join(" ")}">
<span class="stateName">${visualVersion.name}</span>
<span class="pointsTo"> : </span>
<span class="valueStart">${visualVersion.values.startState}</span>
<span class="valueReduced">${visualVersion.values.reducedState}</span>
<span class="valueNew">${visualVersion.values.newState}</span>
<ul>${childrenText}</ul>
</li>
`;
  return res;
};

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

const makeTaskLI = function (debugInfo) {
  let task = debugInfo.task;
  let visualVersion = debugInfo.visualVersion;
  let stateTreeUL = makeStateTreeUL(visualVersion);
  let addedDate = (new Date(task.added)).toISOString();
  let timeToCompute = Math.round((task.stop - task.start) * 100) / 100;
  let computeBody = makeFuncUL(debugInfo.computerInfo, true);
  let observeBody = makeFuncUL(debugInfo.observerInfo, false);

  let li = document.createElement("li");
  li.innerHTML =
    `<span class="eventType">${task.eventType}</span>
<span class="pointsTo"> => </span>
<span class="taskName">${task.taskName}</span>
<span class="added">${addedDate}</span>
<span class="duration">${timeToCompute}</span>

<div class="computes">${computeBody}</div>
<div class="observes">${observeBody}</div>
`
  /*<ul class='stateTree'>${stateTreeUL}</ul>
  `;*/
  return li;
};