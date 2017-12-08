class Tools {

  static resurrectDebugInfo(debugInfoAsString) {
    let data = JSON.parse(debugInfoAsString);
    data.reducedState = Tools.recycle(data.startState, data.reducedState);
    data.computedState = Tools.recycle(data.reducedState, data.computedState);
    data.newState = Tools.recycle(data.computedState, data.newState);
    data.computerInfo.stop = Tools.recycle(data.computerInfo.start, data.computerInfo.stop);
    data.observerInfo.stop = Tools.recycle(data.observerInfo.start, data.observerInfo.stop);
    return data;
  };

  //If the path in A is identical to a path in B, the use the object in A in C, instead of the object in B
  //returns a new object, identical to B, but that reuses objects in and under A where they are
  //completely identical and identically positioned under A and B.
  static recycle(A, B) {
    if (A === B)
      return A;
    if (!(A instanceof Object) || !(B instanceof Object))
      return B;
    let C = {};
    for (let key in B)
      C[key] = Tools.recycle(A[key], B[key]);
    return Tools.identicalObjectsOneLevelCheck(A, C) ? A : C;
  }

  static identicalObjectsOneLevelCheck(A, B) {
    let bKeys = Object.keys(B);
    let aKeys = Object.keys(A);
    if (bKeys.length !== aKeys.length)
      return false;
    for (let key of aKeys) {
      if (bKeys.indexOf(key) === -1)
        return false;
    }
    return true;
  }
}