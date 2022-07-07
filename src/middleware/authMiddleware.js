const { redirect } = require("../response");

const parseCookies = (cookiesString = '') => {
  return cookiesString.split(';').reduce((cookies, rawCookie) => {
    const [field, value] = rawCookie.split('=');
    cookies[field] = value;

    return cookies;
  }, {});
};

const injectCookies = (req, res) => {
  req.cookies = parseCookies(req.headers.cookie);
};

const authenticate = (req, res, next) => {
  const { sessionId } = req.cookies;
  const session = req.session.getSession(sessionId);

  if (!sessionId && !session) {
    redirect(res, '/login');
    return;
  }

  next();
};

const checkAuth = (req, res, next) => {
  const { sessionId } = req.cookies;
  const session = req.session.getSession(sessionId);

  if (session && sessionId) {
    redirect(res, '/guestbook');
    return;
  }

  next();
}

module.exports = { injectCookies, authenticate, checkAuth };