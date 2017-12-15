import {StateTree} from "./StateTree.js";

const DetailLITemplate = document.createElement("li");
DetailLITemplate.classList.add("state-observer");
DetailLITemplate.innerHTML = `
<h4 class="state-observer__header1">Observers</h4>
<ul class="state-observer__observers"></ul>
<h4 class="state-observer__header2">State</h4>
<ul class="state-observer__state"></ul>`;


export const ObservableStateLI = class ObservableStateLI {

  static makeStateDetail(debugInfo, visualVersion, id) {
    const li = DetailLITemplate.cloneNode(true);
    li.contentID = id;
    let stateObject = StateTree.make(id + "_state", visualVersion);
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

}