const parsePostParams = (req, res, next) => {
  let rawParams = '';
  req.on('data', (chunk) => rawParams += chunk);
  req.on('end', () => {
    const searchParams = new URLSearchParams(rawParams);
    const bodyParams = {};

    searchParams.forEach((value, field) => {
      bodyParams[field] = value;
    });

    req.bodyParams = bodyParams;
    next();
  });
};

module.exports = { parsePostParams };
