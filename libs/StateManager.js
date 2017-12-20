import {Tools} from "./Tools.js";

export class StateManager {

  constructor() {
    this.debugInfoList = [];
    this.selectedPath = null;
    this.selectedDetail = null;
    this.debugCounter = 0;

    window.addEventListener("task-selected", e => this.setSelectDetail(e.detail));
    window.addEventListener("path-clicked", e => this.setSelectPath(e.detail));
    window.addEventListener("state-open", e => this.toogleOpen(e.detail));
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

  toogleOpen(path) {
    alert(path);
  }

  getVisualVersion() {
    return this.selectedDetail ? StateManager.addSelectedToVisualVersion(this.selectedDetail.visualVersion, this.selectedPath) : undefined;
  }

  getObserverInfo() {
    return StateManager.addSelectedPathToObservers(this.selectedDetail.observerInfo, this.selectedPath);
  }

  onChange(cb) {
    this.notify = cb;
  }

  static addSelectedPathToObservers(observers, selectedPath) {
    for (let funcName in observers) {
      let func = observers[funcName]
      for (let argNumber in func.triggerPaths) {
        let arg = func.triggerPaths[argNumber];
        observers = Tools.setIn(observers, [funcName, "triggerPaths", argNumber, "selected"], arg.path.join(".") === selectedPath);
      }
    }
    return observers;
  }

  static addSelectedToVisualVersion(visVers, selectedPath) {
    for (let propName in visVers.children) {
      let prop = visVers.children[propName];
      if (prop.compute) {
        for (let argName in prop.compute.triggerPaths) {
          let arg = prop.compute.triggerPaths[argName];
          visVers = Tools.setIn(visVers, ["children", propName, "compute", "triggerPaths", argName, "selected"], arg.path.join(".") === selectedPath);
        }
      }
    }
    return visVers;
  }

  static appendComputesToState(visualVersion, computerInfo) {
    for (let computeName in computerInfo) {
      let compute = computerInfo[computeName];
      if (!visualVersion.children[computeName])
        visualVersion = Tools.setIn(visualVersion, ["children", computeName], {children: [], style: [], values: {}});
      visualVersion = Tools.setIn(visualVersion, ["children", computeName, "compute"], compute);
    }
    return visualVersion;
  }
}

