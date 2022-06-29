const path = require('path');
const fs = require('fs');

const notFound = (request, response, next) => {
  response.statusCode = 404;
  response.end('Not Found');
};

const determineFileType = (extension) => {
  const types = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.css': 'text/css'
  };

  return types[extension];
};

const fileHandler = (request, response, next) => {
  const { pathname } = request.url;
  const fileName = './public' + pathname;

  if (pathname === '/') {
    next();
    return;
  }

  if (fs.existsSync(fileName)) {
    const fileType = determineFileType(path.extname(fileName));
    response.setHeader('content-type', fileType);

    fs.readFile(fileName, (err, content) => {
      response.end(content);
    });
    return;
  }

  next();
};

module.exports = { notFound, fileHandler };
