const createError = (message) => JSON.stringify({ error: message })

const badRequest = (res) => {
  res.statusCode = 405;
  res.end(createError('Bad Request'));
};

const canNotProcess = (res) => {
  res.statusCode = 500;
  res.end(createError('Server is unable to process request.'));
};

const redirect = (res, location) => {
  res.statusCode = 302;
  res.setHeader('location', location);
  res.end();
};

const sendHTML = (res, html) => {
  res.setHeader('content-type', 'text/html');
  res.end(html);
}

module.exports = {
  badRequest, canNotProcess, redirect, sendHTML
};
