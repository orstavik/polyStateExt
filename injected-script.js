console.info("To debug the injected script StatePrinter, click here!");

class StatePrinter {

  constructor() {
    this.debugHookFirstTime = true;
    debugger;
    window.addEventListener("state-history-changed", this.checkStateHistory.bind(this));
    window.dispatchEvent(new CustomEvent('state-get-history'));
  }

  checkStateHistory(e) {
    const history = e.detail;
    if (!this.debugHookFirstTime)
      return window.dispatchEvent(new CustomEvent('state-changed-debug', {detail: StatePrinter.jsonSnap(history[0])}));
    for (let snap of history.reverse())
      window.dispatchEvent(new CustomEvent('state-changed-debug', {detail: StatePrinter.jsonSnap(snap)}));
    this.debugHookFirstTime = false;
  }

  static diffObjsAsPaths(a, b, path) {
    let res = {};
    res[path] = StatePrinter.diff(a, b);
    if (res[path] === "NoChange" || !(a instanceof Object || b instanceof Object))
      return res;

    if (!(a instanceof Object)) a = {};
    if (!(b instanceof Object)) b = {};

    if (path.length > 0) path += ".";
    for (let key in a)
      res = Object.assign(res, StatePrinter.diffObjsAsPaths(a[key], b[key], path + key));
    for (let key in b){
      if (!(key in a))
        res = Object.assign(res, StatePrinter.diffObjsAsPaths(a[key], b[key], path + key));
    }
    return res;
  }

  static jsonSnap(debugInfo) {
    let visualVersion = StatePrinter.compareObjects("state", debugInfo.startState, debugInfo.reducedState, debugInfo.newState);
    return JSON.stringify({
      task: debugInfo.task,
      visualVersion: visualVersion,
      computerInfo: debugInfo.computerInfo,
      observerInfo: debugInfo.observerInfo,
      diffStartReduced: StatePrinter.diffObjsAsPaths(debugInfo.startState, debugInfo.reducedState, ""),
      diffReducedComputed: StatePrinter.diffObjsAsPaths(debugInfo.reducedState, debugInfo.computedState, "")
    });
  }

  //.name, .diff, .style, .values.startState/.reducedState/.newState, .children
  static compareObjects(name, startState, reducedState, newState) {
    let res = {};
    res.name = name;
    res.style = [
      "reduce" + StatePrinter.diff(startState, reducedState),
      "compute" + StatePrinter.diff(reducedState, newState)
    ];
    res.values = {
      startState: StatePrinter.isObject(startState) ? "" : startState,
      reducedState: StatePrinter.isObject(reducedState) ? "" : reducedState,
      newState: StatePrinter.isObject(newState) ? "" : newState,
    };
    res.children = {};

    for (let prop of StatePrinter.getAllObjectKeys(newState, reducedState, startState)) {
      let start = startState ? startState[prop] : undefined;
      let reduced = reducedState ? reducedState[prop] : undefined;
      let nevv = newState ? newState[prop] : undefined;
      res.children[prop] = StatePrinter.compareObjects(prop, start, reduced, nevv);
    }
    return res;
  }

  static getAllObjectKeys(computedState, reducedState, startState) {
    let allKeys = [];
    if (computedState && typeof computedState === "object")
      allKeys = Object.keys(computedState);
    if (reducedState && typeof reducedState === "object")
      for (let key in reducedState)
        if (allKeys.indexOf(key) === -1)
          allKeys.push(key);
    if (startState && typeof startState === "object")
      for (let key in startState)
        if (allKeys.indexOf(key) === -1)
          allKeys.push(key);
    return allKeys;
  }

  static isObject(obj) {
    return (obj && typeof obj === "object");
  }

  static diff(a, b) {
    if (a === b) return "NoChange";
    if (a === undefined) return "Added";
    if (b === undefined) return "Deleted";
    if (StatePrinter.objectEqualOneLayer(a, b)) return "SubAltered";
    return "Altered";
  }

  static objectEqualOneLayer(a, b) {
    if (!(a instanceof Object) || !(b instanceof Object))
      return false;
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    return aKeys.length === bKeys.length && aKeys.every(key => bKeys.indexOf(key) >= 0);
  }
}

new StatePrinter();