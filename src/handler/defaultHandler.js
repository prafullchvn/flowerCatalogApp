const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

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
    '.css': 'text/css',
    '.mp3': ''
  };

  return types[extension];
};

const fileHandler = (request, response, next) => {
  const { pathname } = request.url;
  const filePath = './public' + pathname;

  if (pathname === '/') {
    next();
    return;
  }

  if (fs.existsSync(filePath)) {
    const fileType = mime.lookup(filePath);

    response.setHeader('content-type', fileType);
    response.setHeader('transfer-encoding', 'chunked');

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
    readStream.on('end', () => response.end());
    return;
  }

  next();
};

module.exports = { notFound, fileHandler };
