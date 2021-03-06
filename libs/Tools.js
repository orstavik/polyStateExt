/**
 * Created by ivar.orstavik and tom.fales 2017.
 */
export class Tools {

  static navigate(path) {
    history.pushState({}, null, path);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  static emit(name, payload) {
    return window.dispatchEvent(new CustomEvent(name, {
      composed: true,
      bubbles: true,
      detail: payload,
    }));
  }

  debounce(callback, ms) {
    let _debouncers = window.__superSpecificPolymerDebouncerLongNameArray;
    if (!_debouncers)
      _debouncers = window.__superSpecificPolymerDebouncerLongNameArray = {};
    _debouncers[callback.name] = Polymer.Debouncer.debounce(
      _debouncers[callback.name], // initially undefined
      Polymer.Async.timeOut.after(ms),
      callback);
  }

  throttle(callback, ms) {
    this._throttleTimeout = this._throttleTimeout || null;
    if (!this._throttleTimeout)
      this._throttleTimeout = setTimeout(() => {
        this._throttleTimeout = null;
        callback();
      }, ms);
  }

  static lockPath(obj, path, msg){
    return {};//todo not implemented
  }

  static objectEquals(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) { return false; }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) { return x === y; }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) { return false; }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    // recursive object equality check
    let p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
      p.every(function (i) { return Tools.objectEquals(x[i], y[i]); });
  }

  static testPath(root, path){
    if(!root)
      return false;
    for (let key of path) {
      if (!root[key])
        return false;
      root = root[key];
    }
    return true;
  }

  static removeUndefinedFields(obj){
    let res = Object.assign({}, obj);
    for (let key in res) {
      if (res[key] === undefined)
        delete res[key];
    }
    return res;
  }

  //todo use the filter method recursively to add, delete, update doc data in the objects as well.
  static filterFirestore(origin, path, filter) {
    const _frozen = true;
    let res = Object.assign({}, origin);
    const start = res;
    for (let key of path) {
      if (!res[key])
        res[key] = {};
      res = res[key] = Object.assign({}, res[key]);
    }
    for (let key in res) {
      if (!filter[key])
        delete res[key];
    }
    for (let key in filter) {
      if (!res[key])
        res[key] = filter[key];
    }
    return _frozen ? Tools.deepFreeze(start) : start;
  }

  static deepFreeze(o) {
    if (!o) return o;
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach((prop) => {
      if (o.hasOwnProperty(prop) &&
        o[prop] !== null &&
        (typeof o[prop] === "object" || typeof o[prop] === "function") &&
        !Object.isFrozen(o[prop])) {
        this.deepFreeze(o[prop]);
      }
    });
    return o;
  }

  static deepClone(obj) {
    const freeze = true;
    if (null == obj || "object" != typeof obj)
      return obj;
    let clone = Object.assign({}, obj);
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr))
        clone[attr] = Tools.deepClone(obj[attr], freeze);
    }
    return freeze ? Object.freeze(clone) : clone;
  }

  //returns an immutable copy of A with the branches of B either
  // - merged (if they differ) or
  // - nulled out in result (if B point null value).
  //
  //if either only B === null, then the branch will be deleted. (if the same criteria was set for A, it would be impossible to write in a new value for the same key later)
  //if either A or B === undefined or {} (empty object), then the other branch is used.
  static mergeDeepWithNullToDelete(A, B) {
    const freeze = true;
    if (B === null) return null;
    if (B === undefined || Tools.emptyObject(B))
      return freeze ? Object.freeze(A) : A;
    if (A === undefined || Tools.emptyObject(A))
      return freeze ? Object.freeze(B) : B;
    if (A === B)
      return freeze ? Object.freeze(A) : A;
    if (!(A instanceof Object && B instanceof Object))
      return freeze ? Object.freeze(B) : B;

    let C = Object.assign({}, A);
    let hasMutated = false;
    for (let key of Object.keys(B)) {
      const a = A[key];
      const b = B[key];
      let c = Tools.mergeDeepWithNullToDelete(a, b, freeze);
      if (c === a)
        continue;
      hasMutated = true;
      if (c === null)
        delete C[key];
      else
        C[key] = c; //null is also set as a value in C
    }
    if (!hasMutated)
      return freeze ? Object.freeze(A) : A;
    if (Object.keys(C).length === 0)
      return {};
    return freeze ? Object.freeze(C) : C;
  }

  /**
   * Flattens a normal object tree to an array of {path, value} objects
   * where path is an array of keys as strings. Only works with objects.
   *
   *     let tree = {a: {x: 1}, b: {y: {"12": "something"}}};
   *     let flatTree = Tools.flatten(tree, "start", "/");
   *     //flatTree == {"start/a/x": 1, "start/b/y/12: "something"}
   *
   * @param object object to be flattened
   * @param startPath <string> to be used (att! does this path use the same segment separator as you send in)
   * @param separator "/" or "."
   * @returns an object of [{path: <array>, value: ?}] for that object
   */
  static flatten(object, startPath, separator) {
    startPath = startPath ? [startPath] : [];
    separator = separator || ".";

    const _flattenImpl = function (obj, path, separator, res) {
      if (obj instanceof Object) {
        for (let key of Object.keys(obj))
          _flattenImpl(obj[key], path.concat([key]), separator, res);
      } else if (obj !== undefined) {
        res[path.join(separator)] = obj;
      }
    };

    const res = {}; //mutable
    _flattenImpl(object, startPath, separator, res);
    return res;
  }

  /**
   * adds a startPath to all keys
   *
   * let flat = {"a/b": 1, c: 2, "xyz/12": 3};
   * let extendedFlat = State.pathsToObject("new/root/", flat);
   * extendedFlat == {"new/root/a/b": 1, "new/root/c": 2, "new/root/xyz/12": 3}; //true
   *
   * @param flat an array of a flattened object
   * @param {string} startPath
   * @param {string} separator used between the elements of the path, such as "." or "/"
   * @returns a new object with extended key names.
   */
  static pathsToObject(flat, startPath, separator) {
    let result = {};
    for (let pathValue of flat)
      result[startPath + pathValue.path.join(separator)] = pathValue.value;
    return result;
  }

  static setIn(obj, path, value) {
    const freeze = true;
    return Tools.getIn(obj, path) === value ? obj : Tools.setInNoCheck(obj, path, value, freeze);
  }

  //returns sets a value to object tree path,
  //if some part of that path is explicitly set to null,
  //then nothing is set and undefined is returned
  static setInNoCheck(obj, path, value) {
    const freeze = true;
    let rootRes = Object.assign({}, obj);
    let resPath = [];
    let res = rootRes;
    if (res === null) return undefined;
    for (let i = 0; i < path.length - 1; i++) {
      let key = path[i];
      res[key] = Object.assign({}, res[key]);
      resPath[i] = res[key];
      res = res[key];
      if (res === null) return undefined;
    }
    res[path[path.length - 1]] = freeze ? Object.freeze(value) : value;

    for (let i = 0; i < resPath.length; i++) {
      Object.freeze(resPath[i]);
    }

    return freeze ? Object.freeze(rootRes) : rootRes;
  }

  /**
   * Immutable set function that acccepts null as wildcard in a path.
   * Because we have the wildcard function, no values will be set in the object if the path does not match.
   *
   * @param {object} obj the object in which the values are to be set
   * @param {object} path ["prop1", null, "prop2"] that path to the value to be set.
   *                 If one of the values are null, then all the properties at that level will be traversed
   * @param {object} value the value to be set. Try to use null and not undefined if you want to set something to nothing.
   * @returns a new object C with the new value(s) set. As few objects are cloned as possible.
   */
  static setInPathWithNullAsWildCard(obj, path, value) {
    if (path.length === 0)
      return value;
    if (obj === undefined)
      return undefined;
    if (obj === null)
      return obj;
    let res = Object.assign({}, obj);
    let key = path[0];
    if (key === null) {
      let mutated = false;
      for (let key of Object.keys(res)) {
        let newValue = Tools.setInPathWithNullAsWildCard(res[key], path.slice(1), value);
        if (newValue !== res[key]) {
          mutated = true;
          res[key] = newValue;
        }
      }
      return mutated ? res : obj;
    }
    let newValue = Tools.setInPathWithNullAsWildCard(res[key], path.slice(1), value);
    if (newValue === res[key])
      return obj;
    res[key] = newValue;
    return res;
  }

  static getIn(obj, path) {
    if (!(obj instanceof Object)) return undefined;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      obj = obj[key];
      if (!(obj instanceof Object)) return undefined;
    }
    return obj[path[path.length - 1]];
  }

  /**
   * Immutable filter that strips out
   * 1) entries of A that are matching exactly entries in B
   * 2) all empty entries (with undefined or empty objects as value).
   *
   * @param {object} A the object to be filtered
   * @param {object} B the filter
   * @returns A if nothing is filtered away,
   *          undefined if A is empty or the whole content of A is filtered out by B,
   *          a new object C which is an immuted version of the partially filtered A.
   */
  static filterDeep(A, B) {
    const noA = A === undefined || Tools.emptyObject(A);
    const noB = B === undefined || Tools.emptyObject(B);
    if (noA && noB) return undefined;
    if (noB) return A;
    if (noA) return undefined;
    if (A === B) return undefined;
    if (!(A instanceof Object && B instanceof Object)) return A;

    const C = {};
    let hasFiltered = false;
    for (let key of Object.keys(A)) {
      const a = A[key];
      const b = B[key];
      if (a === null && b === undefined) {
        hasFiltered = true; //todo Work with this, maybe make a nicer model in realtimeboard.
        continue;
        /*second check is removing A[key]=null && B[key]=undefined*/
      }
      let c = Tools.filterDeep(a, b);
      if (c !== a)
        hasFiltered = true;
      if (c !== undefined)
        C[key] = c;
    }
    if (!hasFiltered)
      return A;
    if (Object.keys(C).length === 0)
      return undefined;
    return C;
  }

  static isNothing(A) {
    return A === undefined || A === null || this.emptyObject(A);
  }

  static emptyObject(A) {
    return A instanceof Object && Object.keys(A).length === 0;
  }

  //removes the
  static filterPath(obj, key, value) {
    const res = Object.assign({}, obj);
    if (key === null) {
      let hasFiltered = false;
      for (let key of Object.keys(res)) {
        if (res[key] === value) {
          hasFiltered = true;
          delete res[key];
        }
      }
      return hasFiltered ? res : obj;
    }
    if (res[key] === value) {
      delete res[key];
      return res;
    }
    return obj;
  }

  // static matchesPathValue(CC, ["shapes", null, "selected"], true);
  static matchesPathValue(obj, path, value) {
    if (!obj) return undefined;
    const key = path[0];
    if (path.length === 1) {
      if (key !== null) {
        if (obj[key] === value)
          return obj;
        return undefined;
      }
      const res = {};
      for (let key of Object.keys(obj)) {
        if (obj[key] === value)
          return obj;
      }
      return undefined;
    }
    const nextPath = path.slice(1);
    if (key !== null) {
      let child = Tools.matchesPathValue(obj[key], nextPath, value);
      if (child === undefined)
        return undefined;
      return obj;
    }
    let res = {};
    for (let key of Object.keys(obj)) {
      let child = Tools.matchesPathValue(obj[key], nextPath, value);
      if (child !== undefined)
        res[key] = child;
    }
    if (Object.keys(res).length)
      return res;
    return undefined;
  }

  /**
   * Fancy ID generator that creates 20-character string identifiers with the following properties:
   *
   * 1. They're based on timestamp so that they sort *after* any existing ids.
   * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
   * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
   * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
   *    latter ones will sort after the former ones.  We do this by using the previous random bits
   *    but "incrementing" them by 1 (only in the case of a timestamp collision).
   */
  static genKey() {
    let now = new Date().getTime();
    let duplicateTime = (now === Tools.lastPushTime);
    Tools.lastPushTime = now;

    const timeStampChars = new Array(8);
    for (let i = 7; i >= 0; i--) {
      timeStampChars[i] = Tools.PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.');

    let id = timeStampChars.join('');

    if (!duplicateTime) {
      for (let i = 0; i < 12; i++) {
        Tools.lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (let i = 11; i >= 0 && Tools.lastRandChars[i] === 63; i--) {
        Tools.lastRandChars[i] = 0;
      }
      Tools.lastRandChars[i]++;
    }
    for (let i = 0; i < 12; i++) {
      id += Tools.PUSH_CHARS.charAt(Tools.lastRandChars[i]);
    }
    if (id.length !== 20)
      throw new Error('Length should be 20.');
    return id;
  }
}

// Modeled after base64 web-safe chars, but ordered by ASCII.
Tools.PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
// Timestamp of last push, used to prevent local collisions if you push twice in one ms.
Tools.lastPushTime = 0;
// We generate 72-bits of randomness which get turned into 12 characters and appended to the
// timestamp to prevent collisions with other clients.  We store the last characters we
// generated because in the event of a collision, we'll use those same characters except
// "incremented" by one.
Tools.lastRandChars = [];