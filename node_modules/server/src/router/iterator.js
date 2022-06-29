class Iterator {
  constructor(handlers, ...param) {
    this.handlers = handlers;
    this.index = -1;
    this.param = param;
  }

  next() {
    this.index++;
    this.handlers[this.index](...this.param, () => this.next());
  }
}

module.exports = { Iterator };