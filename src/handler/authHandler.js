const render = require("../render");
const { redirect } = require("../response");

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

const handleLogin = (req, res) => {
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

module.exports = { login, handleLogin, logout, signup, };