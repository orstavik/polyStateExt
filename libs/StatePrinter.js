class StatePrinter {

  static debug(aFuncReg, bFuncReg){
    let C = {};
    for (let key in aFuncReg) {
      let A = aFuncReg[key];
      let B = bFuncReg[key];
      if (A === B)
        continue;
      let triggerPaths = [];
      for(let i= 0; i< B.argsValue.length; i++){
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
	"reduce" +StatePrinter.diff(startState, reducedState), 
	"compute" +StatePrinter.diff(reducedState, newState)
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

/*
  static printList(arrayOfDebugs) {
    let str = ""; 
    for(let deb of arrayOfDebugs) {
      str += "\n"  + deb.task.taskName + " " + deb.task.start;
    }
    return str;
  }

  static testAll(debugInfo) {
    let compared = StatePrinter.compareObjects2("state", debugInfo.startState, debugInfo.reducedState, debugInfo.computedState);
    return StatePrinter.printTest(compared, 0);
  }

  static printTest(visualVersion, depth) {
    let res = "";
    for (let i = 0; i < depth; i++) res += "  ";
    res += visualVersion.name;
    res += " (";
    res += visualVersion.style.join(", ");
    res += ")";
    res += " = " + visualVersion.values.startState;
    res += " / " + visualVersion.values.reducedState;
    res += " / " + visualVersion.values.computedState;
    // console.log(res);
    for (let childName in visualVersion.children)
      res += "\n" + StatePrinter.printTest(visualVersion.children[childName], depth + 1);
    return res;
  }
*/
