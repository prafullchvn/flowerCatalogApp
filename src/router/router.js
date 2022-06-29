const { Route, executeHandlers } = require('./route.js');

class Router {
  #routes;
  #defaultHandlers;
  #middleware;
  constructor() {
    this.#routes = {};
    this.#middleware = [];
    this.#defaultHandlers = [];
  }

  get(path, ...handler) {
    const route = this.#routes[path] || new Route();
    route.addHandler('GET', ...handler);
    this.#routes[path] = route;
  }

  post(path, ...handler) {
    const route = this.#routes[path] || new Route();
    route.addHandler('POST', ...handler);
    this.#routes[path] = route;
  }

  addDefaultHandler(handler) {
    this.#defaultHandlers.push(handler);
  }

  addMiddleware(middleware) {
    this.#middleware.push(middleware);
  }

  #runMiddlewares(request, response) {
    this.#middleware.forEach(middleware => middleware(request, response));
  }

  routeTo(request, response) {
    const { pathname } = request.url;
    const route = this.#routes[pathname];

    this.#runMiddlewares(request, response);

    if (route) {
      route.routeTo(request, response);
      return;
    }

    executeHandlers(this.#defaultHandlers, request, response);
  }
}

module.exports = { Router };
