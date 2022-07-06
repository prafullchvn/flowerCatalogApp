const render = require("../render");
const { redirect } = require("../response");

// const sessions = {};

// const createSession = (username, password) => {
//   const date = new Date();
//   return { username, password, date, sessionId: date.getTime() };
// };

const parseCookies = (cookiesString = '') => {
  return cookiesString.split(';').reduce((cookies, rawCookie) => {
    const [field, value] = rawCookie.split('=');
    cookies[field] = value;

    return cookies;
  }, {});
};

// general middleware
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

const login = (req, res) => {
  console.log(req.session);

  render('./public/login.html', {}, (html) => {
    res.setHeader('content-type', 'text/html');
    res.end(html);
  });
};

const logout = (req, res) => {
  const { sessionId } = req.cookies;
  const session = req.session.getSession(sessionId);

  if (session && sessionId) {
    req.session.removeSession(sessionId); //delete session
    res.setHeader('Set-Cookie', `sessionId=${sessionId}; Max-Age=0`);

    redirect(res, '/login');
    return;
  }

  res.statusCode = 400;
  res.end('No user have logged in');
}

const handleLogin = (req, res, next) => {
  const { username, password } = req.bodyParams;

  const sessionId = req.session.addUser(username, password);

  res.setHeader('set-cookie', `sessionId=${sessionId}`);
  redirect(res, '/guestbook');
};

const signup = (req, res) => {
  render('./public/signup.html', {}, (html) => {
    res.setHeader('content-type', 'text/html');
    res.end(html);
  })
};

module.exports = {
  login,
  handleLogin,
  injectCookies,
  authenticate,
  logout,
  signup,
  checkAuth
};