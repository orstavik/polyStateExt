import {Tools} from "./Tools.js";

export class StateManager {

  constructor() {
    this.debugInfoList = [];
    this.selectedPath2 = {};
    this.selectedDetail = null;
    this.debugCounter = 0;
    this.openedPaths = {"state": true};

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
    this.selectedPath2 = {};
    this.selectedPath2[path] = true;
    this.notify(this);
  }

  setSelectDetail(id) {
    this.selectedDetail = this.debugInfoList[Number(id)];
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
    if (!this.selectedDetail)
      return undefined;
    return StateManager.addToogleOpen(this.openedPaths, this.selectedDetail.visualVersion);
  }

  getHighlights(){
    return this.openedPaths;
  }

  static addToogleOpen(openedPaths, visVers) {
    for (let togglePath in openedPaths) {
      let pathArray = togglePath.split(".");
      for (let i = 0; i < pathArray.length; i++) {
        let path = pathArray.slice(0, i + 1);
        path = path.join(".children.").split(".").slice(1);
        visVers = Tools.setIn(visVers, path.concat(["open"]), true);
      }
    }
    return visVers;
  }

  getObserverInfo() {
    return this.selectedDetail.observerInfo;
  }

  getSelectedPath2() {
    return this.selectedPath2;
  }

  onChange(cb) {
    this.notify = cb;
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

