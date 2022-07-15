const fs = require('fs');

const render = require('../render.js');

const createRow = ({ id, timestamp, name, comment }) => {
  return [
    `<tr id="${id}">`,
    `<td>${timestamp}</td>`,
    `<td>${name}</td>`,
    `<td>${comment}</td>`,
    '</tr>'
  ].join('');
};

const validate = (req, res, next) => {
  const { comment } = req.bodyParams;

  if (comment.trim() === '') {
    res.redirect('/guestbook');
    return;
  }

  next();
}

const createLoader = (dbFile, writeFile) => () => {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

const createSaver = (dbFile, readFile) => (guestbook) => {
  fs.writeFileSync(dbFile, guestbook, 'utf8');
};

class GuestbookHandler {
  #comments;
  #template;

  constructor(comments, template, dbFile) {
    this.#comments = comments;
    this.#template = template;
  }

  index(req, res) {
    this.#comments.load();

    const comments = this.#comments.getAllComment();
    const commentRows = comments.map(createRow).join('');
    const username = req.user.username;

    render(
      this.#template,
      { user: `Welcome, ${username}`, error: '', commentRows }, (html) =>
      res.send(html)
    );
  }

  registerCommentApi(req, res) {
    const { timestamp, body: { comment } } = req;
    const name = req.user.username;

    this.#comments.load();

    const newComment = { name, timestamp, comment };
    const commentSaved = this.#comments.addComment(newComment);

    if (comment === '') {
      res.status(400).json({ error: 'comment can not be empty' });
      return;
    }

    if (!commentSaved) {
      res.status(500).json({ error: 'Failed to add comment' });
      return;
    }

    this.#comments.save();

    res.status(200).json(newComment);
  }

  latestCommentApi(req, res) {
    const latestId = req.query.id;

    this.#comments.load();
    const comments = this.#comments.getAllComment();
    const filteredComments = comments.filter(({ id }) => id > latestId);

    res.status(200).json(filteredComments);
  }
}


module.exports = {
  validate,
  GuestbookHandler,
  createLoader,
  createSaver
};
