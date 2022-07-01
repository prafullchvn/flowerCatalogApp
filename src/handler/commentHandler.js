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

const decodeParam = (rawParam) => {
  let decodedParam = rawParam.replaceAll('+', ' ');
  return decodeURIComponent(decodedParam);
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

const createCommentAdder = ({ dbFile }) => (req, res) => {
  const name = req.url.searchParams.get('name');
  const comment = req.url.searchParams.get('comment');
  const timestamp = req.timestamp;

  if (!addComment(dbFile, { name, timestamp, comment })) {
    res.statusCode = 500;
    res.end('Can not process the request');
    return;
  }

  res.statusCode = 302;
  res.setHeader('location', '/guestbook');
  res.end();
}

const render = (fileName, { message, error, commentRows }, callback) => {
  fs.readFile(fileName, 'utf8', (err, content) => {

    let html = content.replace('@commentRows', commentRows);
    html = html.replace('@error', decodeParam(error));
    html = html.replace('@message', decodeParam(message));

    callback(html);
  });
};

const showGuestBook = ({ template, dbFile }) => (req, res) => {
  const fileName = template;
  console.log('printing data something');
  const message = req.url.searchParams.get('message') || '';
  const error = req.url.searchParams.get('error') || '';

  const comments = getAllComment(dbFile);
  const commentRows = comments.map(createRow).join('');

  render(fileName, { message, error, commentRows }, (html) => {
    res.setHeader('content-type', 'text/html');
    res.end(html)
  });
};

module.exports = {
  validate,
  showGuestBook,
  createCommentAdder
};
