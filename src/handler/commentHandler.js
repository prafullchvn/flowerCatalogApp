const fs = require('fs');
const { getAllComment, addComment } = require('../model/comment.js');

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
  const name = req.url.searchParams.get('name');
  const comment = req.url.searchParams.get('comment');

  if (!name.trim() && !comment.trim()) {
    res.statusCode = 302;
    res.setHeader('location', '/guestbook');
    res.end()
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
  constructor(guestbook, template, dbFile) {
    this.guestbook = guestbook;
    this.template = template;
    this.dbFile = dbFile;
  }

  index(req, res) {
    const message = req.url.searchParams.get('message') || '';
    const error = req.url.searchParams.get('error') || '';

    this.guestbook.load(guestBookLoader(this.dbFile));

    const comments = this.guestbook.getAllComment();
    const commentRows = comments.map(createRow).join('');

    render(this.template, { message, error, commentRows }, (html) => {
      res.setHeader('content-type', 'text/html');
      res.end(html)
    });
  }

  registerComment(req, res) {
    const name = req.url.searchParams.get('name');
    const comment = req.url.searchParams.get('comment');
    const timestamp = req.timestamp;

    this.guestbook.load(guestBookLoader(this.dbFile));

    if (!this.guestbook.addComment({ name, timestamp, comment })) {
      res.statusCode = 500;
      res.end('Can not process the request');
      return;
    }

    this.guestbook.save(guestbookSaver(this.dbFile));
    res.statusCode = 302;
    res.setHeader('location', '/guestbook');
    res.end();
  }
}


module.exports = {
  validate,
  // createCommentAdder,
  CommentHandler
};
