import {Tools} from "./Tools.js";

export class StateManager {

  constructor() {
    this.debugInfoList = [];
    this.selectedPath = {};
    this.debugCounter = 0;
    this.openedPaths = {};
    this.relevants = {};

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
    this.added = StateManager.filterDiffPaths(data.diffStartReduced, "Added");
    this.deleted = StateManager.filterDiffPaths(data.diffStartReduced, "Deleted");
    this.realAltered = StateManager.filterDiffPaths(data.diffStartReduced, "Altered");
    this.subAltered = StateManager.filterDiffPaths(data.diffStartReduced, "SubAltered");
    this.altered = Object.assign({}, this.realAltered, this.subAltered);
    this.changed = Object.assign({}, this.altered, this.added, this.deleted);
    // this.openedPaths = Object.assign({}, this.changed);
    this.notify(this);
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

  getObserverInfo() {
    return this.observerInfo;
  }

  getSelectedPath() {
    return this.selectedPath;
  }

  getRelevants() {
    return this.relevants;
  }

  getOpenPaths() {
    let openedPaths = Object.assign({}, this.openedPaths, this.changed, this.selectedPath);
    return StateManager.allPathsAndParentPaths(openedPaths);
  }

  getWrapperPaths() {
    const opened = this.getOpenPaths();
    return {
      opened: opened,
      added: this.added,
      deleted: this.deleted,
      altered: this.altered,
      selected: this.selectedPath,
      relevant: this.relevants
    }
  }

  onChange(cb) {
    this.notify = cb;
  }

  //todo see if the paths in the funcObj maybe should be made into strings at outset.
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

  static allPathsAndParentPaths(openedPaths) {
    let res = {};
    for (let path in openedPaths) {
      let parentPaths = path.split(".");
      for (let i = 1; i <= parentPaths.length; i++) {
        let pPath = parentPaths.slice(0, i).join(".");
        res[pPath] = true;
      }
    }
    return res;
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

  static filterDiffPaths(paths, check) {
    const res = {};
    for (let key in paths) {
      if (paths[key] === check)
        res[key] = check;
    }
    return res;
  }
}

