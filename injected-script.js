console.info("To debug the injected script StatePrinter, click here!");

class StatePrinter {

  constructor() {
    this.debugHookFirstTime = true;
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

  static jsonSnap(debugInfo) {
    let visualVersion = StatePrinter.compareObjects("state", debugInfo.startState, debugInfo.reducedState, debugInfo.newState);
    let computerInfo = StatePrinter.makeTriggerFuncs(debugInfo.computerInfo.start, debugInfo.computerInfo.stop);
    return JSON.stringify({
      task: debugInfo.task,
      visualVersion: visualVersion,
      computerInfo: computerInfo,
      observerInfo: StatePrinter.makeTriggerFuncs(debugInfo.observerInfo.start, debugInfo.observerInfo.stop)
    });
  }

  static makeTriggerFuncs(startReg, stopReg) {
    let C = {};
    for (let key in startReg)
      C[key] = StatePrinter.makeTriggerFunc(startReg[key], stopReg[key]);
    return C;
  }

  static makeTriggerFunc(start, stop) {
    return {
      funcName: start.funcName,
      triggerReturn: StatePrinter.makeTriggerPath(start.returnPath, start.returnValue, stop.returnValue),
      triggerPaths: StatePrinter.arrToObj(start.argsPaths.map((p, i) => StatePrinter.makeTriggerPath(p, start.argsValue[i], stop.argsValue[i])))
    };
  }

  static makeTriggerPath(path, startValue, stopValue) {
    return {
      path,
      startValue,
      stopValue,
      triggered: startValue !== stopValue
    };
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
    if (typeof a !== "object" || typeof b !== "object")
      return false;
    if (a === null || b === null)
      return false;
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length)
      return false;
    for (let key of aKeys) {
      if (bKeys.indexOf(key) === -1)
        return false;
    }
    return true;
  }

  static arrToObj(arr) {
    const res = {};
    for (let i = 0; i < arr.length; ++i)
      res[i] = arr[i];
    return res;
  }
}

new StatePrinter();