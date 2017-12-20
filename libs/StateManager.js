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
    return this.selectedDetail ? this.selectedDetail.visualVersion : undefined;
  }

  getObserverInfo(){
    return this.selectedDetail.observerInfo;
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

