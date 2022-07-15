const render = require("../render");
const { redirect } = require("../responseMessages.js");
const { user } = require('../model/user.js');

const login = (req, res) => {
  render('./src/resource/login.html', { error: '' }, (html) => res.send(html));
};

const logout = (req, res) => {
  if (req.user) {
    const userSessionId = req.user.sessionId;

    req.session.removeSession(userSessionId);
    res.clearCookie('userSessionId').redirect('/login');

    return;
  }

  res.status(400).send('No user have logged in');
}

const handleLogin = (req, res) => {
  const { username, password } = req.body;

  if (user.authenticateUser(username, password)) {
    const userSessionId = req.session.addData({ username, password });

    res.cookie('userSessionId', userSessionId).redirect('/guestbook');
    return;
  }

  render('./src/resource/login.html',
    { error: 'Invalid credentials' },
    (html) => {
      res.status(400).send(html);
    });
};

const signup = (req, res) => {
  render('./src/resource/signup.html', { error: '' }, (html) => {
    res.send(html);
  })
};

const handleSignUp = (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    user.addUser(username, password);
    const userSessionId = req.session.addData({ username, password });

    res.cookie('userSessionId', userSessionId).redirect('/guestbook');
    return;
  }

  render(
    './src/resource/signup.html',
    { error: 'Please enter valid credentials' },
    html => {
      res.status(400).send(html);
    }
  )
};

module.exports = { login, handleLogin, logout, signup, handleSignUp };