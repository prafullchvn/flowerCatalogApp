const path = require('path');
const fs = require('fs');

const notFound = (request, response, next) => {
  response.statusCode = 404;
  response.send('Not Found');
};

const determineFileType = (extension) => {
  const types = {
    '.jpeg': 'image/jpeg',
    '.txt': 'text/plain',
  };

  return types[extension];
};

const fileHandler = (request, response, next) => {
  const { uri } = request;
  const fileName = './public' + uri;

  if (fs.existsSync(fileName)) {
    const fileType = determineFileType(path.parse('fileName'));
    response.addHeader('content-type', fileType);

    fs.readFile(fileName, (err, content) => {
      response.sendFile(content);
    });
    return;
  }

  next();
};

module.exports = { notFound, fileHandler };
