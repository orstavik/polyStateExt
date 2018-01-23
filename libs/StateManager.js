import {Tools} from "./Tools.js";
import {JoiGraph} from "./JoiGraph.js";

export class StateManager {

  constructor() {
    debugger;
    this.debugInfoList = [];
    this.selectedPath = {};
    this.debugCounter = -1;
    this.openedPaths = {};
    this.relevants = {};

    window.addEventListener("task-selected", e => this.setSelectDetail(e.detail));
    window.addEventListener("path-clicked", e => this.setSelectPath(e.detail));
    window.addEventListener("state-open", e => this.toogleOpen(e.detail));
    window.addEventListener("compute-highlight", e => this.highlightCompute(e.detail));
  }

  addDebugInfo(deb) {
    //todo here we should make A reuse as much as possible from B??
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
      console.log(id);                    //todo this should never happen!
      return;
    }
    this.observerInfo = data.observerInfo;
    this.computerInfo = data.computerInfo;
    this.fullTreeWithPathsToDataParentLevelStyle = StateManager.makeFullTreeWithPathsToDataParentLevelStyle(data.startState, data.reducedState, data.newState)
    //todo replace all the res in fullTree with cached version using JSON.stringify keys?
    // this.paths = StateManager.makePaths(data.newState, data.startState);
    this.notify(this);
  }

  getFullTree() {
    return this.fullTreeWithPathsToDataParentLevelStyle;
  }

  //todo mutate madness
  static makeFullTreeWithPathsToDataParentLevelStyle(startStateObj, reducedStateObj, newStateObj) {
    let startState = JoiGraph.flatten(startStateObj);
    let reducedState = JoiGraph.flatten(reducedStateObj);
    let newState = JoiGraph.flatten(newStateObj);
    const fullTree = JoiGraph.orderedAssign(startState, newState);

    //todo use the const below to give an error if the reduced state is not covered by the fullTree
    const reducedIsCovered = Object.getOwnPropertyNames(reducedState).every(path => path in fullTree);

    const paths = Object.getOwnPropertyNames(fullTree);
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      let res = {
        path,
        start: startState[path],
        reduced: reducedState[path],
        computed: newState[path],
      };
      if (res.start !== res.reduced)
        res.changeReduced =
          res.start === undefined ? "added" :
            res.reduced === undefined ? "deleted" :
              "changed";
      if (res.reduced !== res.computed)
        res.changeComputed =
          res.reduced === undefined ? "added" :
            res.computed === undefined ? "deleted" :
              "changed";
      fullTree[path] = res;
    }
    return StateManager.addParentStyle(fullTree);
  }

  //todo mutates fullTree
  static addParentStyle(fullTree) {
    const paths = Object.getOwnPropertyNames(fullTree);
    for (let i = 0; i < paths.length; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        let path = paths[i];
        let nextPath = paths[j];
        if (!nextPath.startsWith(path))
          break;
        fullTree[path].isParent = true;
        if (fullTree[nextPath].changeReduced)
          fullTree[path].parentReduced = fullTree[nextPath].changeReduced;
        if (fullTree[nextPath].changeComputed)
          fullTree[path].parentComputed = fullTree[nextPath].changeComputed;
      }
    }
    return fullTree;
  }

  static makePaths(newState, startState) {
    const computed = JoiGraph.flatten(newState);
    const start = JoiGraph.flatten(startState);

    const alteredComputed = JoiGraph.filterDeep(computed, start);
    const alteredStart = JoiGraph.filterDeep(start, computed);

    const altered = Object.getOwnPropertyNames(alteredComputed);
    const alteredReverse = Object.getOwnPropertyNames(alteredStart);
    const notInComputed = alteredReverse.filter(name => altered.indexOf(name) === -1);
    const changed = altered.concat(notInComputed);

    // const openedPaths = Object.assign({}, this.openedPaths, this.paths.changed, this.selectedPath);
    // return StateManager.allPathsAndParentPaths(openedPaths);

    return {
      added: altered.filter(name => alteredReverse.indexOf(name) === -1),
      deleted: notInComputed,
      realAltered: alteredReverse.filter(name => altered.indexOf(name) !== -1),
      changed: changed,
      subAltered: JoiGraph.getParentPaths(changed)
    };
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

  getStyle() {
    const addeds = StateManager.pathsToCSSSelectors(this.paths.added, "");//">state-tree");
    const deleteds = StateManager.pathsToCSSSelectors(this.paths.deleted, "");//">.statetree__opener::before");
    const subAltered = StateManager.pathsToCSSSelectors(this.paths.changed, "");
    //language=CSS
    return `
      ${addeds} {
        border: 2px solid red;
      }
      ${deleteds} {
        border: 2px solid orange;
      }
      ${subAltered} {
        display: 2px dotted green;
      }
    `;
  }

  static pathsToCSSSelectors(paths, ending) {
    if (!paths || paths.length === 0)
      return "inactive";
    return paths.map(path => StateManager.pathToCSSSelectorFullPath(path, ending)).join(",\n");
  }

  static pathToCSSSelectorFullPath(path, ending) {
    return `[path='${path}']` + ending;
  }

  getWrapperPaths() {
    return this.paths;
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

