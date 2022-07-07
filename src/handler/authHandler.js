const render = require("../render");
const { redirect } = require("../responseMessages.js");
const { user } = require('../model/user.js');

const login = (req, res) => {
  render('./public/login.html', { error: '' }, (html) => {
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

const handleLogin = (req, res) => {
  const { username, password } = req.bodyParams;

  if (user.authenticateUser(username, password)) {
    const sessionId = req.session.addUser(username, password);

    res.setHeader('set-cookie', `sessionId=${sessionId}`);

    redirect(res, '/guestbook');
    return;
  }

  render('./public/login.html', { error: 'Invalid credentials' }, (html) => {
    res.statusCode = 401;
    res.end(html);
  })
};

const signup = (req, res) => {
  render('./public/signup.html', { error: '' }, (html) => {
    res.setHeader('content-type', 'text/html');
    res.end(html);
  })
};

const handleSignUp = (req, res) => {
  const { username, password } = req.bodyParams;

  if (username && password) {
    user.addUser(username, password);

    const sessionId = req.session.addUser(username, password);

    res.setHeader('set-cookie', `sessionId=${sessionId}`);
    redirect(res, '/guestbook');
    return;
  }

  render(
    './public/signup.html',
    { error: 'Please enter valid credentials' },
    html => {
      res.setHeader('content-type', 'text/html');
      res.end(html);
    }
  )
};

module.exports = { login, handleLogin, logout, signup, handleSignUp };