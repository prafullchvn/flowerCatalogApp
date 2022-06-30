const fs = require('fs');

const COMMENT_FILE = './src/resource/comments.json';

const getAllComment = (dbFile) => {
  const rawComments = fs.readFileSync(dbFile, 'utf8');
  return JSON.parse(rawComments)
}

const addComment = (dbFile, { timestamp, name, comment }) => {
  const comments = getAllComment(dbFile);
  comments.unshift({ timestamp, name, comment });
  try {
    fs.writeFileSync(dbFile, JSON.stringify(comments), 'utf8');
  } catch (err) {
    return false;
  }
  return true;
}

module.exports = { getAllComment, addComment };