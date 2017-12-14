const ComputeDIV = document.createElement("div");
ComputeDIV.classList.add("compute");
ComputeDIV.innerHTML = `
  <span class="compute__icon">&#9881;</span>
  <span class="compute__description">
    <span class="compute__return"></span> = 
    <span class="compute__name"></span>(<span class="compute__args"></span>)
  </span>
`;

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


}