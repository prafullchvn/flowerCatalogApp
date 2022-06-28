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
  const { name, comment } = req.queryParams;
  const fileName = `${req.rootDir}/guestBook.html`;

  console.log('error');

  if (!name.trim() && !comment.trim()) {
    const error = 'Please provide the valid name and comment.';
    render(fileName, '', error, (html) => res.sendHTML(html));

    return;
  }

  req.queryParams = { name: name.trim(), comment: comment.trim() };
  next();
}

const decodeParam = (rawParam) => {
  let decodedParam = rawParam.replaceAll('+', ' ');
  return decodeURIComponent(decodedParam);
};

const registerComment = (req, res) => {
  const { name: rawName, comment: rawComment } = req.queryParams;

  const name = decodeParam(rawName);
  const comment = decodeParam(rawComment);
  const timestamp = new Date().toLocaleString();

  if (!addComment({ name, timestamp, comment })) {
    res.statusCode = 500;
    res.send('Can not process the request');
    res.redirect('/guestbook');
    return;
  }

  res.redirect('/guestbook');
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

  const message = req.queryParams.message || '';
  const error = req.queryParams.error || '';

  render(fileName, message, error, (html) => res.sendHTML(html));
};

module.exports = {
  validate,
  guestBook,
  registerComment
};
