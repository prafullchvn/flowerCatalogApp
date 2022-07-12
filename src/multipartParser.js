const CRLF = Buffer.from('\r\n');
const DOUBLE_CRLF = Buffer.from('\r\n\r\n');

const extractHeaders = group => {
  let CRLFIndex = group.indexOf(CRLF);
  let headerBoundary = group.indexOf(DOUBLE_CRLF);

  return group.slice(CRLFIndex, headerBoundary);
}

const extractBody = group => {
  const startOfBody = group.indexOf(DOUBLE_CRLF) + DOUBLE_CRLF.length;
  return group.slice(startOfBody, group.length - CRLF.length);
}

const parseHeaders = rawHeaders => {
  const headers = rawHeaders.toString().trim().replace(CRLF, ';');

  return headers.split(';').reduce((parsed, header) => {
    const fieldValue = header.split('=');
    if (fieldValue.length > 1) {
      parsed[fieldValue[0].trim()] = fieldValue[1].trim();
    }
    return parsed;
  }, {});
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

const createFieldGroup = ({ name, buffer: body, fileName }) => {
  if (fileName) {
    return { filename: fileName, buffer: body };
  }
  return body;
}


const parse = (buffer, boundary) => {
  const boundaryLength = boundary.length;
  let start = 0 + boundaryLength;
  let end = buffer.indexOf(boundary, start);
  let parsedRequestBody = {};

  while (end !== -1) {
    const parsedGroup = parseGroup(buffer.slice(start, end));
    const { name } = parsedGroup;

    if (parsedRequestBody[name]) {
      parsedRequestBody[name] = [].concat(parsedRequestBody[name]);
      parsedRequestBody[name].push(createFieldGroup(parsedGroup));
    } else {
      parsedRequestBody[name] = createFieldGroup(parsedGroup);
    }

    start = end + boundaryLength;
    end = buffer.indexOf(boundary, start);
  }

  return parsedRequestBody;
}

module.exports = parse;
