const fs = require('fs');

const responseMessage = require('../response.js');
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
  const { name, comment } = req.bodyParams;

  if (!name.trim() && !comment.trim()) {
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

    const username = req.session.getSession(req.cookies.sessionId).username;

    render(this.#template, { user: `Welcome, ${username}`, error: '', commentRows }, (html) =>
      sendHTML(res, html)
    );
  }

  registerComment(req, res) {
    const { timestamp, bodyParams: { name, comment } } = req;
    this.#guestbook.load(guestBookLoader(this.#dbFile));

    if (!this.#guestbook.addComment({ name, timestamp, comment })) {
      canNotProcess(res);
      return;
    }

    this.#guestbook.save(guestbookSaver(this.#dbFile));
    redirect(res, '/guestbook');
  }
}


module.exports = {
  validate,
  GuestbookHandler
};
