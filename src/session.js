class Session {
  #registry;
  constructor() {
    this.#registry = {};
  }

  addData(data) {
    const date = new Date();
    const sessionId = date.getTime()
    const newSession = { data, date, sessionId };

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