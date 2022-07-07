const { redirect } = require("../responseMessages.js");

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

const injectUser = (req, res) => {
  const { userSessionId } = req.cookies;
  const userSession = req.session.getSession(userSessionId);

  if (userSessionId && userSession) {
    req.user = userSession.data;
  }
};

const authenticate = (req, res, next) => {
  if (!req.user) {
    res.setHeader('set-cookie', 'userSessionId=0; max-age:0');
    redirect(res, '/login');
    return;
  }

  next();
};

const checkAuth = (req, res, next) => {
  if (req.user) {
    redirect(res, '/guestbook');
    return;
  }

  next();
}

module.exports = { injectCookies, authenticate, checkAuth, injectUser };