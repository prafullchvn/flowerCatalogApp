const fs = require('fs');

class Comments {
  #comments;
  #latestId;
  #saveComments;
  #loadComments;

  constructor(saveComments, loadComments) {
    this.#comments = [];
    this.#latestId = 0;
    this.#saveComments = saveComments;
    this.#loadComments = loadComments;
  }

  load(loader) {
    const parsedData = this.#loadComments();
    this.#comments = parsedData.comments;
    this.#latestId = parsedData.id;
  }

  save(saver) {
    const obj = {
      comments: this.#comments,
      id: this.#latestId
    }
    this.#saveComments(JSON.stringify(obj));
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

module.exports = { Comments };
