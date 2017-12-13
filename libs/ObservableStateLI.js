const DetailLITemplate = document.createElement("li");
DetailLITemplate.classList.add("state-observer");
DetailLITemplate.innerHTML = `
<h4 class="state-observer__header1">Observers</h4>
<ul class="state-observer__observers"></ul>
<h4 class="state-observer__header2">State</h4>
<ul class="state-observer__state"></ul>`;

const StateLITemplate = document.createElement("li");
StateLITemplate.classList.add("state");
StateLITemplate.innerHTML = `
<details class="state__body">
  <summary class="state__summary">
    <span class="state__name"></span>:
    <span class="state__value"></span>
  </summary>
  <ul class="state__children"></ul>
</details>`;

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
    li.querySelector(".state-observer__state").append(stateObject);
    for (let funcName in debugInfo.observerInfo)
      li.querySelector(".state-observer__observers").append(ComputeObserveFuncLI.makeFuncUL(debugInfo.observerInfo[funcName], false));
    return li;
  }

  static makeStateTreeUL(data, id) {
    const li = StateLITemplate.cloneNode(true);
    li.id = id;
    li.classList.add(...data.style);
    if (Object.keys(data.children).length !== 0)
      li.classList.add("state--has-children");
    if (data.compute) {
      li.classList.add("state--computes");
      li.querySelector(".state__summary").prepend(ComputeObserveFuncLI.makeComputeDIV(data.compute));
    }

    li.querySelector(".state__name").textContent = data.name;
    li.querySelector(".state__value").textContent = data.values.newState;
    // li.querySelector("span.valueReduced").textContent = data.values.reducedState;
    // li.querySelector("span.valueNew").textContent = data.values.newState;
    const childUL = li.querySelector(".state__children");
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