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

  onChange(cb) {
    this.notify = cb;
  }

}

