const express = require('express');

const pagesHandler = require('./handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower, uploadFile } = pagesHandler;

const guestbookHandler = require('./handler/guestbookHandler.js');
const { GuestbookHandler, validate } = guestbookHandler;

const { addTimestamp } = require('./middleware/addTimestamp.js');
const { GuestBook } = require('./model/comment.js');
const { parsePostParams } = require('./middleware/paramsParser.js');

const authHandler = require('./handler/authHandler.js');
const { login, handleLogin, logout, signup, handleSignUp, } = authHandler;

const auth = require('./middleware/authMiddleware.js');
const injectCookies = require('./middleware/injectCookies.js');
const injectRootDir = require('./middleware/injectRootDir.js');
const injectUrl = require('./middleware/injectUrl.js');
const { authenticate, checkAuth, injectUser } = auth;


const createApp = (config, session) => {
  const app = express();

  app.use(addTimestamp);
  app.use(injectCookies);
  app.use((req, res, next) => {
    req.session = session;
    next();
  });
  app.use(injectUser);
  app.use(express.urlencoded({ extended: true }));
  app.use(injectRootDir);
  app.use(injectUrl);

  app.get('/', index);
  app.get('/index', index);
  app.get('/abelio', abelioFlower);
  app.get('/ageratum', ageratumFlower);
  app.post('/uploadFile', parsePostParams, uploadFile);

  app.get('/login', checkAuth, login);
  app.post('/login', handleLogin);
  app.get('/logout', logout);

  app.get('/signup', checkAuth, signup);
  app.post('/signup', handleSignUp);

  const { template, dbFile } = config;
  const guestbook = new GuestBook();
  const commentHandler = new GuestbookHandler(guestbook, template, dbFile);

  app.get('/guestbook',
    authenticate,
    (req, res) => commentHandler.index(req, res)
  );

  app.post('/register-comment',
    authenticate,
    validate,
    (req, res) => commentHandler.registerComment(req, res)
  );

  app.post('/register-comment-api',
    authenticate,
    (req, res) => commentHandler.registerCommentApi(req, res)
  );

  app.get('/latest-comment-api',
    authenticate,
    (req, res) => commentHandler.latestCommentApi(req, res)
  );

  app.use(express.static('public'));

  return app;
};

module.exports = { createApp };

