const fs = require('fs');

const responseMessage = require('../response.js');
const { canNotProcess, redirect, sendHTML } = responseMessage;

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

const render = (fileName, { message, error, commentRows }, callback) => {
  fs.readFile(fileName, 'utf8', (err, content) => {

    let html = content.replace('@commentRows', commentRows);
    html = html.replace('@error', error);
    html = html.replace('@message', message);

    callback(html);
  });
};


const guestBookLoader = (dbFile) => () => {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}


const guestbookSaver = (dbFile) => (guestbook) => {
  fs.writeFileSync(dbFile, guestbook, 'utf8');
};

class CommentHandler {
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

    render(this.#template, { message: '', error: '', commentRows }, (html) =>
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
  CommentHandler
};
