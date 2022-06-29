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
  const fileName = `${req.rootDir}/guestBook.html`;

  if (!name.trim() && !comment.trim()) {
    const error = 'Please provide the valid name and comment.';
    render(fileName, '', error, (html) => {
      res.setHeader('content-type', 'text/html');
      res.end(html)
    });
    return;
  }

  next();
}

const registerComment = (req, res) => {
  const name = req.url.searchParams.get('name');
  const comment = req.url.searchParams.get('comment');
  const timestamp = new Date().toLocaleString();

  if (!addComment({ name, timestamp, comment })) {
    res.statusCode = 500;
    res.end('Can not process the request');
    return;
  }

  res.statusCode = 302;
  res.setHeader('location', '/guestbook');
  res.end();
}

const render = (fileName, message, error, callback) => {
  fs.readFile(fileName, 'utf8', (err, content) => {
    const comments = getAllComment();
    const commentHtml = comments.map(createRow).join('');

    let html = content.replace('__COMMENT_ROWS__', commentHtml);
    html = html.replace('__ERROR__', decodeParam(error));
    html = html.replace('__MESSAGE__', decodeParam(message));

    callback(html);
  });
};

const guestBook = (req, res) => {
  const fileName = `${req.rootDir}/guestBook.html`;

  const message = req.url.searchParams.get('message') || '';
  const error = req.url.searchParams.get('error') || '';

  render(fileName, message, error, (html) => {
    res.setHeader('content-type', 'text/html');
    res.end(html)
  });
};

module.exports = {
  validate,
  guestBook,
  registerComment
};
