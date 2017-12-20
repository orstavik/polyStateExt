import {Tools} from "./Tools.js";

export class StateManager {

  constructor() {
    this.debugInfoList = [];
    this.selectedPath = null;
    this.selectedDetail = null;
    this.debugCounter = 0;

    window.addEventListener("task-selected", e => this.setSelectDetail(e.detail));
    window.addEventListener("path-clicked", e => this.setSelectPath(e.detail));
  }

  addDebugInfo(deb) {
    deb.visualVersion = StateManager.appendComputesToState(deb.visualVersion, deb.computerInfo);
    this.debugInfoList[this.debugCounter++] = deb;
    return this.debugCounter;
  }

  setSelectPath(path) {
    this.selectedPath = path;
    this.notify(this);
  }

  setSelectDetail(id) {
    this.selectedDetail = this.debugInfoList[Number(id)];
    this.notify(this);
  }

  getVisualVersion(){
    if (!this.selectedDetail)
      return undefined;

    let visVers = this.selectedDetail.visualVersion;
    for (let propName in this.selectedDetail.visualVersion.children) {
      let prop = this.selectedDetail.visualVersion.children[propName];
      if (!prop.compute)
        continue;
      for (let argName in prop.compute.triggerPaths) {
        let arg = prop.compute.triggerPaths[argName];
        visVers= Tools.setIn(visVers, ["children", propName, "compute", "triggerPaths", argName, "selected"], arg.path.join(".") === this.selectedPath);
      }
    }
    return visVers;
  }

  getObserverInfo(){
    let observers = this.selectedDetail.observerInfo;
    for (let funcName in this.selectedDetail.observerInfo) {
      let func = this.selectedDetail.observerInfo[funcName]
      for (let argNumber in func.triggerPaths) {
        let arg = func.triggerPaths[argNumber];
        observers = Tools.setIn(observers, [funcName, "triggerPaths", argNumber, "selected"], arg.path.join(".") === this.selectedPath);
      }
    }
    return observers;
  }

  onChange(cb) {
    this.notify = cb;
  }

  static appendComputesToState(visualVersion, computerInfo) {
    for (let computeName in computerInfo) {
      let compute = computerInfo[computeName];
      if (!visualVersion.children[computeName])
        visualVersion = Tools.setIn(visualVersion, ["children", computeName], {children: [], style: [], values: {}});
      visualVersion = Tools.setIn(visualVersion, ["children", computeName, "compute"], compute);    }
    return visualVersion;
  }
}

