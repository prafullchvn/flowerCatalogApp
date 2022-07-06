class Session {
  #registry;
  constructor() {
    this.#registry = {};
  }

  addUser(username, password) {
    const date = new Date();
    const sessionId = date.getTime()
    const newSession = { username, password, date, sessionId };

    this.#registry[sessionId] = newSession;

    return sessionId;
  }

  getSession(sessionId) {
    return this.#registry[sessionId];
  }

  removeSession(sessionId) {
    delete this.#registry[sessionId];
  }
}

module.exports = Session;