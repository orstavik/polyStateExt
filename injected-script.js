class StatePrinter {

  constructor() {
    this.debugHookFirstTime = true;
    window.addEventListener("state-history-changed", this.checkStateHistory.bind(this));
  }

  checkStateHistory(e) {
    const history = e.detail;
    if (!this.debugHookFirstTime)
      return StatePrinter.fireStateChangedDebug(history[0]);
    for (let snap of history.reverse())
      StatePrinter.fireStateChangedDebug(snap);
    this.debugHookFirstTime = false;
  }

  static debugParsedJSON(debugInfo) {
    return JSON.stringify({
      task: debugInfo.task,
      visualVersion: StatePrinter.compareObjects("state", debugInfo.startState, debugInfo.reducedState, debugInfo.newState),
      computerInfo: StatePrinter.debug(debugInfo.computerInfo.start, debugInfo.computerInfo.stop),
      observerInfo: StatePrinter.debug(debugInfo.observerInfo.start, debugInfo.observerInfo.stop)
    });
  }

  static debug(aFuncReg, bFuncReg) {
    let C = {};
    for (let key in aFuncReg) {
      let A = aFuncReg[key];
      let B = bFuncReg[key];
      if (A === B)
        continue;
      let triggerPaths = [];
      for (let i = 0; i < B.argsValue.length; i++) {
        let a = A.argsValue[i];
        let b = B.argsValue[i];
        let triggered = false;
        if (a !== b)
          triggered = true;
        triggerPaths[i] = {path: A.argsPaths[i], triggered: triggered};
      }
      C[key] = {a: A, triggerPaths: triggerPaths};
    }
    return C;
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

  static fireStateChangedDebug(snap) {
    window.dispatchEvent(new CustomEvent('state-changed-debug', {
      composed: true,
      bubbles: true,
      detail: StatePrinter.debugParsedJSON(snap),
    }));
  }

  static objectEqualOneLayer(a, b) {
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object")
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
}

new StatePrinter();
setTimeout(() => {
  thisIsSomethingThatDoesNotExist.whenYouAskForAPropOnThatYouWillSeeTheInjectedScriptInDevToolsSoYouCanDebugIt;
  justRememberToOpenThePolystatePanel.thatShouldDoIt.AndBestOfLuck;
}, 1000);
