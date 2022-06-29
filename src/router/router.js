const { Iterator } = require('./iterator.js');

class Router {
  #routes;
  #defaultHandlers;
  #middleware;
  constructor() {
    this.#routes = {
      get: {},
      post: {}
    };
    this.#middleware = [];
    this.#defaultHandlers = [];
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
    const method = request.method;
    const handlers = this.#routes[method.toLowerCase()][pathname];

    this.#runMiddlewares(request, response);

    if (handlers) {
      const itr = new Iterator(handlers, request, response);
      itr.next();
      return;
    }

    const itr = new Iterator(this.#defaultHandlers, request, response);
    itr.next();
  }
}

module.exports = { Router };
