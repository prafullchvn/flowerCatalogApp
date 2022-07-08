const fs = require('fs');

const responseMessage = require('../responseMessages.js');
const { canNotProcess, redirect, sendHTML } = responseMessage;

const render = require('../render.js');

const createRow = ({ timestamp, name, comment }) => {
  return [
    '<tr>',
    `<td>${timestamp}</td>`,
    `<td>${name}</td>`,
    `<td>${comment}</td>`,
    '</tr>'
  ].join('');
};

const validate = (req, res, next) => {
  const { comment } = req.bodyParams;

  if (!comment.trim()) {
    redirect(res, '/guestbook');
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
      sendHTML(res, html)
    );
  }

  registerComment(req, res) {
    const { timestamp, bodyParams: { comment } } = req;
    const name = req.user.username;

    this.#guestbook.load(guestBookLoader(this.#dbFile));

    if (!this.#guestbook.addComment({ name, timestamp, comment })) {
      canNotProcess(res);
      return;
    }

    this.#guestbook.save(guestbookSaver(this.#dbFile));
    redirect(res, '/guestbook');
  }

  registerCommentApi(req, res) {
    const { timestamp, bodyParams: { comment } } = req;
    const name = req.user.username;

    this.#guestbook.load(guestBookLoader(this.#dbFile));

    const newComment = { name, timestamp, comment };
    const commentSaved = this.#guestbook.addComment(newComment);
    if (!comment && !commentSaved) {
      canNotProcess(res);
      return;
    }

    this.#guestbook.save(guestbookSaver(this.#dbFile));

    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(newComment));
  }
}


module.exports = {
  validate,
  GuestbookHandler
};
