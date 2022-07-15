const parseCookies = (cookiesString = '') => {
  return cookiesString.split(';').reduce((cookies, rawCookie) => {
    const [field, value] = rawCookie.split('=');
    cookies[field] = value;

    return cookies;
  }, {});
};

module.exports = (req, res, next) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
};