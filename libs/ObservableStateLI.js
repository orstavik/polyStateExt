class ObservableStateLI {

  static makeStateTreeUL(data, id) {
    const li = document.createElement("li");
    li.id = id;
    li.classList.add(...data.style);
    li.appendChild(ObservableStateLI.makeSpan(data.name, "stateName"));
    li.appendChild(ObservableStateLI.makeSpan(" : ", "pointsTo"));
    li.appendChild(ObservableStateLI.makeSpan(data.values.startState, "valueStart"));
    li.appendChild(ObservableStateLI.makeSpan(data.values.reducedState, "valueReduced"));
    li.appendChild(ObservableStateLI.makeSpan(data.values.newState, "valueNew"));
    const childUL = document.createElement("ul");
    for (let childName in data.children)
      childUL.appendChild(ObservableStateLI.makeStateTreeUL(data.children[childName], id + "_" + childName));
    li.appendChild(childUL);
    return li;
  }

  static makeSpan(innerText, clazz){
    const span = document.createElement("span");
    span.classList.add(clazz);
    span.innerText = innerText;
    return span;
  }
}