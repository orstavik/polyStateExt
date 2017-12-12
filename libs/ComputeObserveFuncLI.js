const funcTemplate = document.createElement("li");
funcTemplate.innerHTML =`
<span class="returnProp"></span>
<span class="pointsTo functionSign"> = </span>
<span class="funcName"></span>
<span class="pointsTo argsStart">(</span>
<span class="funcArgs"></span>
<span class="pointsTo argsEnd">)</span>
`;

const pathTemplate = document.createElement("span");
pathTemplate.classList.add("funcArgPath");

const CommaTemplate = document.createElement("span");
CommaTemplate.textContent = ", ";
CommaTemplate.classList.add("pointsTo");

class ComputeObserveFuncLI {
  static makeFuncUL(data, isCompute) {
    const li = funcTemplate.cloneNode(true);
    if (isCompute)
      li.querySelector("span.returnProp").append(ComputeObserveFuncLI.makeArgsPath(data.triggerReturn));
    //todo add so that triggered is not always true for the returnProp.. need to do this in the actual functions register somehow
    li.querySelector("span.funcName").innerText = data.a.funcName;
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

    const index = e.path[5].id;
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