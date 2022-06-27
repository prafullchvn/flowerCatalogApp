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

const getTimestamp = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const date = now.toLocaleDateString();

  return `${date} ${hours}:${minutes}:${seconds}`;
}

const validate = (req, res, next) => {
  const { name, comment } = req.queryParams;

  if (!name.trim() && !comment.trim()) {
    res.statusCode = 400;
    res.send('Bad comment');
    return;
  }

  req.queryParams = { name: name.trim(), comment: comment.trim() };
  next();
}

const formatComment = (comment) => comment.replace('+', ' ');

const registerComment = (req, res) => {
  const timestamp = getTimestamp();
  const { name, comment: rawComment } = req.queryParams;
  const comment = formatComment(rawComment);

  if (!addComment({ name, timestamp, comment })) {
    res.statusCode = 500;
    res.send('Can not process the request');
    return;
  }

  res.sendHTML('<h1> Comment Added successfully.</h1>');
}

const guestBook = (req, res) => {
  const fileName = `${req.rootDir}/guestBook.html`;

  fs.readFile(fileName, 'utf8', (err, content) => {
    const comments = getAllComment();
    const commentHtml = comments.map(createRow).join('');

    res.sendHTML(content.replace('__COMMENT_ROWS__', commentHtml));
  });
};

module.exports = {
  validate,
  guestBook,
  registerComment
};
