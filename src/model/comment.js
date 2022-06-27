const fs = require('fs');

const COMMENT_FILE = './src/resource/comments.json';

const getAllComment = () => {
  const rawComments = fs.readFileSync(COMMENT_FILE, 'utf8');
  return JSON.parse(rawComments)
}

const addComment = ({ timestamp, name, comment }) => {
  const comments = getAllComment();
  comments.unshift({ timestamp, name, comment });
  try {
    fs.writeFileSync(COMMENT_FILE, JSON.stringify(comments), 'utf8');
  } catch (err) {
    return false;
  }
  return true;
}

module.exports = { getAllComment, addComment };