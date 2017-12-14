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
    div.querySelector(".compute__return").append(ComputeObserveFuncLI.makeArgsPath(data.triggerReturn));
    div.querySelector(".compute__name").innerText = data.funcName;
    div.addEventListener("click", e => {
      div.classList.toggle("compute--active");
      e.stopPropagation();
    });
    const args = div.querySelector(".compute__args");
    for (let i = 0; i < data.triggerPaths.length; i++) {
      if (i !== 0) args.append(CommaTemplate.cloneNode(true));
      args.append(ComputeObserveFuncLI.makeArgsPath(data.triggerPaths[i]));
    }
    return div;
  };

  static makeFuncUL(data, isCompute) {
    const li = funcTemplate.cloneNode(true);
    if (isCompute)
      li.querySelector("span.returnProp").append(ComputeObserveFuncLI.makeArgsPath(data.triggerReturn));
    li.querySelector("span.funcName").innerText = data.funcName;
    const args = li.querySelector("span.funcArgs");
    for (let i = 0; i < data.triggerPaths.length; i++) {
      if (i !== 0) args.append(CommaTemplate.cloneNode(true));
      args.append(ComputeObserveFuncLI.makeArgsPath(data.triggerPaths[i]));
    }
    return li;
  };

  static makeArgsPath(path) {
    const span = pathTemplate.cloneNode(true);
    span.textContent = path.path.join(".");
    if (path.triggered)
      span.classList.add("triggered");
    span.addEventListener("click", ComputeObserveFuncLI.togglePathArgs);
    return span;
  }

  static togglePathArgs(e) {
    const oldFlash = document.querySelectorAll(".flash");
    for (let oldi of oldFlash)
      oldi.classList.remove("flash");

    const index = e.path[5].contentID;
    let segments = e.currentTarget.textContent.split(".");

    for (let i = 0; i < segments.length; i++) {
      let partialPath = segments.slice(0, segments.length - i);
      let argPath = partialPath.join("_");
      let detail = document.querySelector("#" + index + "_state_" + argPath);
      detail.classList.add("opened");
    }

    let argPath = segments.join("_");
    let detail = document.querySelector("#s" + index + "_state_" + argPath);
    detail.classList.add("flash");
    detail.scrollIntoViewIfNeeded();
  }
}