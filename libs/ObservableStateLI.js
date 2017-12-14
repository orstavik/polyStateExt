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

export const ObservableStateLI = class ObservableStateLI {

  static makeStateDetail(debugInfo, visualVersion, id) {
    const li = DetailLITemplate.cloneNode(true);
    li.contentID = id;
    let stateObject = ObservableStateLI.makeStateTreeUL(visualVersion, id + "_state");
    li.querySelector(".state-observer__state").append(stateObject);
    let ul = li.querySelector(".state-observer__observers");
    for (let funcData of Object.values(debugInfo.observerInfo)) {
      let li = document.createElement("li");
      let func = document.createElement("observe-function");
      li.append(func);
      func.updateFuncObj(funcData);
      ul.append(li);
    }
    return li;
  }

  static makeStateTreeUL(data, id) {
    const li = StateLITemplate.cloneNode(true);
    li.contentID = id;
    li.classList.add(...data.style);
    if (Object.keys(data.children).length !== 0)
      li.classList.add("state--has-children");
    if (data.compute) {
      li.classList.add("state--computes");
      let computeListing = document.createElement("compute-listing");
      computeListing.updateFuncObj(data.compute);
      li.querySelector(".state__summary").prepend(computeListing);
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
}