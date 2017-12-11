class StatePrinter {

  static parse(debugInfo){
    return {
      task: debugInfo.task,
      visualVersion: StatePrinter.compareObjects("state", debugInfo.startState, debugInfo.reducedState, debugInfo.newState),
      computerInfo: StatePrinter.debug(debugInfo.computerInfo.start, debugInfo.computerInfo.stop),
      observerInfo: StatePrinter.debug(debugInfo.observerInfo.start, debugInfo.observerInfo.stop)
    };
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
      startState: StatePrinter.getPrintValue(startState),
      reducedState: StatePrinter.getPrintValue(reducedState),
      newState: StatePrinter.getPrintValue(newState)
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

  static getPrintValue(obj) {
    if (!obj)
      return obj;
    if (typeof obj === "object")
      return "";
    return obj;
  }

  static diff(a, b) {
    if (a === b) return "NoChange";
    if (a === undefined) return "Added";
    if (b === undefined) return "Deleted";
    return "Altered";
  }
}

ITObservableState.debugHookFirstTime = true;

ITObservableState.debugHook = function(snap, history){
  if (ITObservableState.debugHookFirstTime){
    for (let oldSnap of history.reverse()) {
      let res = StatePrinter.parse(oldSnap);
      Tools.emit('state-changed-debug', JSON.stringify(res));
    }
    ITObservableState.debugHookFirstTime = false;
    return;
  }
  let res = StatePrinter.parse(snap);
  Tools.emit('state-changed-debug', JSON.stringify(res));
};
