const fs = require('fs');

const responseMessage = require('../responseMessages.js');
const { canNotProcess, redirect, sendHTML } = responseMessage;

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

const guestBookLoader = (dbFile) => () => {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

const guestbookSaver = (dbFile) => (guestbook) => {
  fs.writeFileSync(dbFile, guestbook, 'utf8');
};

class GuestbookHandler {
  #guestbook;
  #template;
  #dbFile;

  constructor(guestbook, template, dbFile) {
    this.#guestbook = guestbook;
    this.#template = template;
    this.#dbFile = dbFile;
  }

  index(req, res) {
    this.#guestbook.load(guestBookLoader(this.#dbFile));

    const comments = this.#guestbook.getAllComment();
    const commentRows = comments.map(createRow).join('');
    const username = req.user.username;

    render(this.#template, { user: `Welcome, ${username}`, error: '', commentRows }, (html) =>
      res.send(html)
    );
  }

  registerComment(req, res) {
    const { timestamp, body: { comment } } = req;
    const name = req.user.username;

    this.#guestbook.load(guestBookLoader(this.#dbFile));

    if (!this.#guestbook.addComment({ name, timestamp, comment })) {
      res.status(500).send('can not process');
      return;
    }

    this.#guestbook.save(guestbookSaver(this.#dbFile));
    res.redirect('/guestbook');
  }

  registerCommentApi(req, res) {
    const { timestamp, body: { comment } } = req;
    const name = req.user.username;

    this.#guestbook.load(guestBookLoader(this.#dbFile));

    const newComment = { name, timestamp, comment };
    const commentSaved = this.#guestbook.addComment(newComment);

    if (comment === '') {
      res.status(400).json({ error: 'comment can not be empty' });
      return;
    }

    if (!commentSaved) {
      res.status(500).json({ error: 'Failed to add comment' });
      return;
    }

    this.#guestbook.save(guestbookSaver(this.#dbFile));

    res.status(200).json(newComment);
  }

  latestCommentApi(req, res) {
    const latestId = req.query.id;

    this.#guestbook.load(guestBookLoader(this.#dbFile));
    const comments = this.#guestbook.getAllComment();
    const filteredComments = comments.filter(({ id }) => id > latestId);

    res.status(200).json(filteredComments);
  }
}


module.exports = {
  validate,
  GuestbookHandler
};
