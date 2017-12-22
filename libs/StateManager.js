import {Tools} from "./Tools.js";

export class StateManager {

  constructor() {
    this.debugInfoList = [];
    this.selectedPath = {};
    this.debugCounter = 0;
    this.openedPaths = {};

    window.addEventListener("task-selected", e => this.setSelectDetail(e.detail));
    window.addEventListener("path-clicked", e => this.setSelectPath(e.detail));
    window.addEventListener("state-open", e => this.toogleOpen(e.detail));
    window.addEventListener("compute-highlight", e => this.highlightCompute(e.detail));
  }

  addDebugInfo(deb) {
    deb.visualVersion = StateManager.appendComputesToState(deb.visualVersion, deb.computerInfo);
    this.debugInfoList[++this.debugCounter] = deb;
    this.setSelectDetail(this.debugCounter);
    return this.debugCounter;
  }

  setSelectPath(path) {
    this.selectedPath = {};
    this.selectedPath[path] = true;
    this.relevants = StateManager.getArgumentPathsAsObject(this.computerInfo[path]);
    this.notify(this);
  }

  setSelectDetail(id) {
    let data = this.debugInfoList[Number(id)];
    if (!data) {
      console.log(id);
      return;
    }
    this.visualVersion = data.visualVersion;
    this.observerInfo = data.observerInfo;
    this.computerInfo = data.computerInfo;
    this.notify(this);
  }

  getRelevants() {
    return this.relevants ? this.relevants : {};
  }

  toogleOpen(path) {
    if (this.openedPaths[path]) {                  //remove path, but also all sub paths opened
      for (let sub in this.openedPaths) {
        if (sub.startsWith(path))
          delete this.openedPaths[sub];
      }
    } else {
      this.openedPaths[path] = true;               //add a path
    }
    this.notify(this);
  }

  getVisualVersion() {
    return this.visualVersion;
  }

  getHighlights() {
    return this.openedPaths;
  }

  getObserverInfo() {
    return this.observerInfo;
  }

  getSelectedPath() {
    return this.selectedPath;
  }

  onChange(cb) {
    this.notify = cb;
  }

  static getArgumentPathsAsObject(funcObj) {
    if (!funcObj)
      return {};
    let argPathsObj = {};
    Object.values(funcObj.triggerPaths).map(triggerPath => {
      let path = triggerPath.path.join(".");
      argPathsObj[path] = true;
    });
    return argPathsObj;
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

