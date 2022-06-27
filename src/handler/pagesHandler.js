const fs = require('fs');

const { getAllComments, getAllComment, addComment } = require('../model/comment.js');

const index = (req, res) => {
  const fileName = `${req.rootDir}/index.html`;
  fs.readFile(fileName, (err, content) => {
    res.sendHTML(content);
  });
};

const abelioFlower = (req, res) => {
  const fileName = `${req.rootDir}/abelioFlower.html`;
  fs.readFile(fileName, (err, content) => {
    res.sendHTML(content);
  });
};

const ageratumFlower = (req, res) => {
  const fileName = `${req.rootDir}/ageratumFlower.html`;
  fs.readFile(fileName, (err, content) => {
    res.sendHTML(content);
  });
};

module.exports = {
  index,
  abelioFlower,
  ageratumFlower
};
