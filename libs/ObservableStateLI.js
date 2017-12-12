const DetailLITemplate = document.createElement("li");
DetailLITemplate.innerHTML = `
<h3>Computeds</h3>
<div class="content computes">
  <ul class="listOfFuncs"></ul>
</div>
<h3>Observers</h3>
<div class="content observes">
  <ul class="listOfFuncs"></ul>
</div>
<ul class="stateObject"></ul>`;

const StateLITemplate = document.createElement("li");
StateLITemplate.innerHTML =
  `<div class="propWrapper">
  <span class="stateName"></span>:
  <span class="valueStart"></span>
  <span class="valueReduced"></span>
  <span class="valueNew"></span>
</div>
<ul></ul>`;

const EventDetailLITemplate = document.createElement("li");
EventDetailLITemplate.innerHTML =
  `<div class="propWrapper">
  <span class="stateName"></span>:
  <span class="valueNew"></span>
</div>
<ul></ul>`;

class ObservableStateLI {

  static makeStateDetail(debugInfo, visualVersion, id) {
    const li = DetailLITemplate.cloneNode(true);
    li.id = id;
    let stateObject = ObservableStateLI.makeStateTreeUL(visualVersion, id + "_state");
    li.querySelector("ul.stateObject").append(stateObject);
    for (let funcName in debugInfo.computerInfo)
      li.querySelector("div.computes>ul").append(ComputeObserveFuncLI.makeFuncUL(debugInfo.computerInfo[funcName], true));
    for (let funcName in debugInfo.observerInfo)
      li.querySelector("div.observes>ul").append(ComputeObserveFuncLI.makeFuncUL(debugInfo.observerInfo[funcName], false));
    return li;
  }

  static makeStateTreeUL(data, id) {
    const li = StateLITemplate.cloneNode(true);
    li.id = id;
    li.classList.add(...data.style);
    if (Object.keys(data.children).length !== 0)
      li.classList.add("hasChildren");

    li.querySelector("div.propWrapper").addEventListener("click", (e) => li.classList.toggle("opened"));
    li.querySelector("span.stateName").textContent = data.name;
    li.querySelector("span.valueStart").textContent = data.values.startState;
    li.querySelector("span.valueReduced").textContent = data.values.reducedState;
    li.querySelector("span.valueNew").textContent = data.values.newState;
    const childUL = li.querySelector("ul");
    for (let childName in data.children)
      childUL.appendChild(ObservableStateLI.makeStateTreeUL(data.children[childName], id + "_" + childName));
    return li;
  }

  static makeEventTreeLI(name, obj) {
    const li = EventDetailLITemplate.cloneNode(true);
    li.querySelector("div.propWrapper").addEventListener("click", (e) => li.classList.toggle("opened"));
    li.querySelector("span.stateName").textContent = name;

    if (obj && typeof obj === "object" && Object.keys(obj).length !== 0) {
      li.classList.add("hasChildren");
      const childUL = li.querySelector("ul");
      for (let childName in obj)
        childUL.appendChild(ObservableStateLI.makeEventTreeLI(childName, obj[childName]));
    } else {
      li.querySelector("span.valueNew").textContent = obj;
    }
    return li;
  }
}