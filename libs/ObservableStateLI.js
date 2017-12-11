const StateLITemplate = document.createElement("li");
StateLITemplate.innerHTML = 
`<div class="propWrapper">
  <span class="stateName"></span>:
  <span class="valueStart"></span>
  <span class="valueReduced"></span>
  <span class="valueNew"></span>
</div>
<ul></ul>`;

class ObservableStateLI {

  static makeStateTreeUL(data, id) {
    const li = StateLITemplate.cloneNode(true);
    li.id = id;
    li.classList.add(...data.style);
    if (Object.keys(data.children).length !== 0)
      li.classList.add("hasChildren");

    li.querySelector(".propWrapper").addEventListener("click", (e) => li.classList.toggle("opened"));
    li.querySelector("span.stateName").textContent = data.name;
    li.querySelector("span.valueStart").textContent = data.values.startState;
    li.querySelector("span.valueReduced").textContent = data.values.reducedState;
    li.querySelector("span.valueNew").textContent = data.values.newState;
    const childUL = li.querySelector("ul");
    for (let childName in data.children)
      childUL.appendChild(ObservableStateLI.makeStateTreeUL(data.children[childName], id + "_" + childName));
    return li;
  }
}