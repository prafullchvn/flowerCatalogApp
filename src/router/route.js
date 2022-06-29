const executeHandlers = (handlers, req, res) => {
  let index = 0;
  const next = () => {
    index++;
    handlers[index](req, res, next);
  }

  return handlers[index](req, res, next);
};

class Route {
  #handlers;
  constructor() {
    this.#handlers = {};
  }

  addHandler(method, ...handlers) {
    const list = this.#handlers[method] || [];
    list.push(...handlers);
    this.#handlers[method] = list;
  }

  routeTo(req, res) {
    const { method } = req;
    const handlers = this.#handlers[method];
    if (!handlers) {
      res.statusCode = 405;
      res.end('Bad request');
      return;
    }

    executeHandlers(handlers, req, res);
  }
}

module.exports = { Route, executeHandlers }; 