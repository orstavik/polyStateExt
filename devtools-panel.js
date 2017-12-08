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
    const snapShot = JSON.parse(request.payload);
    const li = makeTaskLI(snapShot);
    taskListUL.appendChild(li);
    rememberSnap(snapShot);
    details.innerHTML = `<ul class="stateTree">${stateList[stateList.length-1]}</ul>`;
  }
});

const taskListUL = document.querySelector("#taskList>ul");
const details = document.querySelector('#stateDetails');
const stateList = [];

function rememberSnap(snap) {
  let visualVersion = StatePrinter.compareObjects("state", snap.startState, snap.reducedState, snap.newState);
  stateList.push(makeStateTreeUL(visualVersion));
}

function makeStateTreeUL(visualVersion) {
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

function makeFuncUL(info, compute) {
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

function makeAddedTime(timestamp) {
  const t = new Date(timestamp);
  let h = t.getHours();
  h = '0'.repeat(2-h.toString().length)+h;
  let m = t.getMinutes();
  m = '0'.repeat(2-m.toString().length)+m;
  let s = t.getSeconds();
  s = '0'.repeat(2-s.toString().length)+s;
  let ms = t.getMilliseconds();
  ms = '0'.repeat(3-ms.toString().length)+ms;
  return `${h}:${m}:${s}.${ms}`;
}

function makeTaskLI (debugInfo) {
  let task = debugInfo.task;
  let addedDate = makeAddedTime(task.added);
  let timeToCompute = Math.round((task.stop - task.start) * 100) / 100;
  let computeBody = makeFuncUL(debugInfo.computerInfo, true);
  let observeBody = makeFuncUL(debugInfo.observerInfo, false);
  let li = document.createElement("li");
  li.dataset.index = taskListUL.children.length;
  li.addEventListener('click', toggleListItem);
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
  const item = e.currentTarget;
  if (item.classList.contains('opened'))
    return item.classList.remove('opened');
  item.classList.add('opened');
  details.innerHTML = `<ul class="stateTree">${stateList[item.dataset.index]}</ul>`;
}