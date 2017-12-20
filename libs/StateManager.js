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
    this.debugInfoList[(this.debugCounter++)] = (deb);
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
    return StateManager.appendComputesToState(this.selectedDetail.visualVersion, this.selectedDetail.computerInfo);
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
        visualVersion.children[computeName] = {children: [], style: [], values: {}};
      visualVersion.children[computeName].compute = compute;
    }
    return visualVersion;
  }
}

