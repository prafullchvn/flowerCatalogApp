const fs = require('fs');

const index = (req, res) => res.sendFile('index.html', { root: req.rootDir });

const abelioFlower = (req, res) => {
  res.sendFile('abelioFlower.html', { root: req.rootDir });
};

const ageratumFlower = (req, res) => {
  res.sendFile('ageratumFlower.html', { root: req.rootDir });
};

const uploadFile = (req, res) => {
  req.bodyParams.text_file?.forEach(({ filename, buffer }) => {
    fs.writeFileSync(`${req.rootDir}/uploaded/${filename}`, buffer);
  });

  req.bodyParams.images?.forEach(({ filename, buffer }) => {
    fs.writeFileSync(`${req.rootDir}/uploaded/${filename}`, buffer);
  })

  res.statusCode = 200;
  res.end('received file');
};

module.exports = {
  index,
  abelioFlower,
  ageratumFlower,
  uploadFile
};
