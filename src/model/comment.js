const fs = require('fs');

const COMMENT_FILE = './src/resource/comments.json';

class GuestBook {
  constructor() {
    this.comments = [];
  }

  load(loader) {
    this.comments = loader();
  }

  save(saver) {
    saver(JSON.stringify(this.comments));
  }

  getAllComment() {
    return this.comments;
  }

  addComment({ timestamp, name, comment }) {
    const comments = this.getAllComment(this.dbFile);
    this.comments.unshift({ timestamp, name, comment });

    return true;
  }
}

module.exports = { GuestBook };
