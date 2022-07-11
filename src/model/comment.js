const fs = require('fs');

class GuestBook {
  #comments;
  #latestId;
  constructor() {
    this.#comments = [];
    this.#latestId = 0;
  }

  load(loader) {
    const parsedData = loader();
    this.#comments = parsedData.comments;
    this.#latestId = parsedData.id;
  }

  save(saver) {
    const obj = {
      comments: this.#comments,
      id: this.#latestId
    }
    saver(JSON.stringify(obj));
  }

  getAllComment() {
    return this.#comments;
  }

  addComment({ timestamp, name, comment }) {
    this.#comments.unshift({ id: this.#latestId, timestamp, name, comment });
    this.#latestId = this.#latestId + 1;

    return true;
  }

  getLatestId() {
    return this.#latestId;
  }
}

module.exports = { GuestBook };
