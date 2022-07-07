class User {
  #users;
  constructor() {
    this.#users = {
      'root': {
        username: 'root',
        password: 'root'
      }
    };
  }

  addUser(username, password) {
    this.#users[username] = { username, password };
  }

  authenticateUser(username, password) {
    const user = this.#users[username];

    return user && user.password === password;
  }
}

module.exports = { user: new User() };
