const fs = require('fs');

const commentFile = './src/resource/comments.json';

const getAllComment = () => {
  const rawComments = fs.readFileSync(commentFile, 'utf8');
  return JSON.parse(rawComments)
}

const addComment = ({ timestamp, name, comment }) => {
  const comments = getAllComment();
  comments.unshift({ timestamp, name, comment });
  try {
    fs.writeFileSync(commentFile, JSON.stringify(comments), 'utf8');
  } catch (err) {
    return false;
  }
  return true;
}

module.exports = { getAllComment, addComment };