const scriptToAttach = `
window.addEventListener('state-changed-debug', (e) => {
  chrome.runtime.sendMessage({
    name: 'new-client-state',
    payload: e.detail
  })
});
`;
chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  script: scriptToAttach
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.name === 'new-client-state') {
    const li = makeTaskLI(JSON.parse(request.payload));
    taskListUL.appendChild(li);
  }
});

// const mainList = [];

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
}

const makeFuncUL = function (info, compute) {
  let filter = StatePrinter.debug(info.start, info.stop);
  let str = "";
  for (let funcName in filter) {
    let data = filter[funcName];
    let spannedArgs = data.triggerPaths.map(p =>
      `<span class='funcArgPath ${p.triggered ? "triggered" : ""}'>${p.path.join(".")}</span>`
    );
    let args = spannedArgs.join(", ");
    let returnValue = compute ?
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
}

const makeTaskLI = function (debugInfo) {
  let task = debugInfo.task;
  let visualVersion = StatePrinter.compareObjects("state", debugInfo.startState, debugInfo.reducedState, debugInfo.newState);
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
}

const getDebugs =
  `(function(){
  let res = ITObservableState.debugList; 
  ITObservableState.debugList = []; 
  return res;
}).call()`;

const taskListUL = document.querySelector("#taskList>ul");

// setInterval(function () {
//   chrome.devtools.inspectedWindow.eval(getDebugs, {}, function (list) {
//     if (!list)
//       return;
//     for (let debugInfo of list)
//       mainList.push(debugInfo);
//   });

//   while(mainList.length > 0) {
//     let firstIn = mainList.shift();
//     let li = makeTaskLI(firstIn);
//     taskListUL.appendChild(li);
//   }

// }, 2000);