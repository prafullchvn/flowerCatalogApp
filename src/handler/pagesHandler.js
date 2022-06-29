const fs = require('fs');

const index = (req, res) => {
  const fileName = `${req.rootDir}/index.html`;
  fs.readFile(fileName, (err, content) => {
    res.setHeader('content-type', 'text/html');
    res.end(content);
  });
};

const abelioFlower = (req, res) => {
  const fileName = `${req.rootDir}/abelioFlower.html`;
  fs.readFile(fileName, (err, content) => {
    res.setHeader('content-type', 'text/html');
    res.end(content);
  });
};

const ageratumFlower = (req, res) => {
  const fileName = `${req.rootDir}/ageratumFlower.html`;
  fs.readFile(fileName, (err, content) => {
    res.setHeader('content-type', 'text/html');
    res.end(content);
  });
};

module.exports = {
  index,
  abelioFlower,
  ageratumFlower
};
