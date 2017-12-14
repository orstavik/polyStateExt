const funcTemplate = document.createElement("li");
funcTemplate.innerHTML = `
<span class="returnProp"></span>
<span class="pointsTo functionSign"> = </span>
<span class="funcName"></span>
<span class="pointsTo argsStart">(</span>
<span class="funcArgs"></span>
<span class="pointsTo argsEnd">)</span>
`;

const ComputeDIV = document.createElement("div");
ComputeDIV.classList.add("compute");
ComputeDIV.innerHTML = `
  <span class="compute__icon">&#9881;</span>
  <span class="compute__description">
    <span class="compute__return"></span> = 
    <span class="compute__name"></span>(<span class="compute__args"></span>)
  </span>
`;

const pathTemplate = document.createElement("span");
pathTemplate.classList.add("funcArgPath");

const CommaTemplate = document.createElement("span");
CommaTemplate.textContent = ", ";
CommaTemplate.classList.add("pointsTo");

export const ComputeObserveFuncLI = class ComputeObserveFuncLI {

  static makeComputeDIV(data) {
    const div = ComputeDIV.cloneNode(true);
    let path = document.createElement("state-path");
    path.updatePath(data.triggerReturn);
    div.querySelector(".compute__return").append(path);
    div.querySelector(".compute__name").innerText = data.funcName;
    div.addEventListener("click", e => {
      div.classList.toggle("compute--active");
      e.stopPropagation();
    });
    const args = div.querySelector(".compute__args");
    for (let i = 0; i < data.triggerPaths.length; i++) {
      if (i !== 0) args.append(CommaTemplate.cloneNode(true));
      let path = document.createElement("state-path");
      path.updatePath(data.triggerPaths[i]);
      args.append(path);
    }
    return div;
  };

  static makeFuncUL(data, isCompute) {
    const li = funcTemplate.cloneNode(true);
    if (isCompute){
      let path = document.createElement("state-path");
      path.updatePath(data.triggerReturn);
      li.querySelector("span.returnProp").append(path);
    }
    li.querySelector("span.funcName").innerText = data.funcName;
    const args = li.querySelector("span.funcArgs");
    for (let i = 0; i < data.triggerPaths.length; i++) {
      if (i !== 0) args.append(CommaTemplate.cloneNode(true));
      let path = document.createElement("state-path");
      path.updatePath(data.triggerPaths[i]);
      args.append(path);
    }
    return li;
  };
}