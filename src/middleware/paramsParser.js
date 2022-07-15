const fs = require('fs');
const parse = require("../multipartParser");

const parseURLEncoded = (rawParams) => {
  const searchParams = new URLSearchParams(rawParams);
  const bodyParams = {};

  searchParams.forEach((value, field) => {
    bodyParams[field] = value;
  });

  return bodyParams;
}

const extractBoundary = header => {
  const boundaryHeader = header.split(';')[1];
  return boundaryHeader.split('=')[1];
}

const parsePostParams = (req, res, next) => {
  let bufferArr = [];

  req.on('data', (chunk) => bufferArr = [...bufferArr, ...chunk]);

  req.on('end', () => {
    const buffer = Buffer.from(bufferArr);
    const contentType = req.headers['content-type'];

    if (contentType && contentType.startsWith('multipart/form-data')) {
      const boundary = extractBoundary(req.headers['content-type']);
      req.bodyParams = parse(buffer, Buffer.from('--' + boundary));

      next();
      return;
    }

    req.bodyParams = parseURLEncoded(buffer.toString());
    next();
  });
};

module.exports = { parsePostParams };
