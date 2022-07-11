const fs = require('fs');


const CRLF = Buffer.from('\r\n');
const DOUBLE_CRLF = Buffer.from('\r\n\r\n');

const extractHeaders = group => {
  let CRLFIndex = group.indexOf(CRLF);
  let headerBoundary = group.indexOf(DOUBLE_CRLF);

  return group.slice(CRLFIndex, headerBoundary);
}

const extractBody = group => {
  const startOfBody = group.indexOf(DOUBLE_CRLF) + 4;
  return group.slice(startOfBody, group.length - 2);
}

const parseHeaders = rawHeaders => {
  const headersToParse = rawHeaders.toString().trim().split(CRLF)[0];


  return headersToParse.toString().split(';').reduce((parsed, header) => {
    const fieldValue = header.split('=');
    if (fieldValue.length > 1) {
      parsed[fieldValue[0].trim()] = fieldValue[1].trim();
    }
    return parsed;
  }, {});

  return {
    name: 'image'
  }
}

const isFile = headers => {
  return Object.keys(headers).includes('filename');
}

const format = (value) => {
  return value.trim().slice(1, value.length - 1)
}

const parseGroup = fieldGroup => {
  const headers = extractHeaders(fieldGroup);
  const body = extractBody(fieldGroup);
  const parsedHeaders = parseHeaders(headers);
  let parsedGroup = {};

  if (!isFile(parsedHeaders)) {
    parsedGroup = {
      name: format(parsedHeaders.name),
      buffer: body.toString().trim()
    };

    return parsedGroup;
  }

  parsedGroup = {
    name: format(parsedHeaders.name),
    fileName: format(parsedHeaders.filename),
    buffer: body
  };

  return parsedGroup;
}


const parse = (buffer, boundary) => {
  let start = 0;
  let end = buffer.indexOf(boundary, start + 1);
  let parsedGroups = {};

  while (end !== -1) {
    const parsedGroup = parseGroup(buffer.slice(start, end));

    const { name, buffer: body, fileName } = parsedGroup;

    if (fileName) {
      fs.writeFileSync('uploaded.jpg', body);
      parsedGroups[name] = { filename: fileName, buffer: body };
    } else {
      parsedGroups[name] = body;
    }

    start = end;
    end = buffer.indexOf(boundary, end + 1);
  }

  return parsedGroups;
}

module.exports = parse;
