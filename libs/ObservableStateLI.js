const StateLITemplate = document.createElement("li");
StateLITemplate.innerHTML = 
`<div class="propWrapper">
  <span class="stateName"></span>
  <span class="pointsTo"> : </span>
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
    li.querySelector(".propWrapper").addEventListener("click", (e) => li.classList.toggle("opened"));
    li.querySelector("span.stateName").textContent = data.name;
    li.querySelector("span.valueStart").textContent = data.name;
    li.querySelector("span.valueReduced").textContent = data.name;
    li.querySelector("span.valueNew").textContent = data.name;
    const childUL = li.querySelector("ul");
    for (let childName in data.children)
      childUL.appendChild(ObservableStateLI.makeStateTreeUL(data.children[childName], id + "_" + childName));
    return li;
  }
}