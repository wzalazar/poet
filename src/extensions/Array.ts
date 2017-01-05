interface Array<T> {
  includes(_: T): boolean;
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(elem) {
    return this.indexOf(elem !== -1);
  }
}

