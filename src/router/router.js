const { Iterator } = require('./iterator.js');

class Router {
  #routes;
  #fallback;
  #middleware;
  constructor() {
    this.#routes = {
      get: {},
      post: {}
    };
    this.#middleware = [];
    this.#fallback = [];
  }

  get(route, ...handler) {
    const list = this.#routes.get[route] || [];
    list.push(...handler);
    this.#routes.get[route] = list;
  }

  post(route, ...handler) {
    const list = this.#routes.post[route] || [];
    list.push(...handler);
    this.#routes.post[route] = list;
  }

  addRoute(route, ...handler) {
    const list = this.#routes[route] || [];
    list.push(...handler);
    this.#routes[route] = list;
  }

  addFallbackHandler(handler) {
    this.#fallback.push(handler);
  }

  addMiddleware(middleware) {
    this.#middleware.push(middleware);
  }

  #runMiddlewares(request, response) {
    this.#middleware.forEach(middleware => middleware(request, response));
  }

  routeTo(request, response) {
    const { uri, method } = request;
    const handlers = this.#routes[method.toLowerCase()][uri];

    this.#runMiddlewares(request, response);

    if (handlers) {
      const itr = new Iterator(handlers, request, response);
      itr.next();
      return;
    }

    const itr = new Iterator(this.#fallback, request, response);
    itr.next();
  }
}

module.exports = { Router };
