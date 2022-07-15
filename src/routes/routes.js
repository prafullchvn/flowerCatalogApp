// const { router } = require('server-using-http-module');
const express = require('express');
const { Router, static } = express;

const pagesHandler = require('../handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower, uploadFile } = pagesHandler;

const guestbookHandler = require('../handler/guestbookHandler.js');
const { GuestbookHandler, validate } = guestbookHandler;

const { addTimestamp } = require('../middleware/addTimestamp.js');
const { GuestBook } = require('../model/comment.js');
const { parsePostParams } = require('../middleware/paramsParser.js');

//auth handler
const { login, handleLogin, logout, signup, handleSignUp, } = require('../handler/authHandler.js');

const auth = require('../middleware/authMiddleware.js');
const injectCookies = require('../middleware/injectCookies.js');
const injectRootDir = require('../middleware/injectRootDir.js');
// const injectSession = require('../middleware/injectSession.js');
const injectUrl = require('../middleware/injectUrl.js');
const Session = require('../session.js');
const { authenticate, checkAuth, injectUser } = auth;


const setRoutes = (config, session) => {
  const router = Router();

  router.use(addTimestamp);
  router.use(injectCookies);
  router.use((req, res, next) => {
    req.session = session;
    next();
  });
  router.use(injectUser);
  router.use(express.urlencoded({ extended: true }));
  router.use(injectRootDir);
  router.use(injectUrl);

  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);
  router.post('/uploadFile', parsePostParams, uploadFile);

  router.get('/login', checkAuth, login);
  router.post('/login', handleLogin);
  router.get('/logout', authenticate, logout);

  router.get('/signup', checkAuth, signup);
  router.post('/signup', handleSignUp);

  const { template, dbFile } = config;
  const guestbook = new GuestBook();
  const commentHandler = new GuestbookHandler(guestbook, template, dbFile);

  router.get('/guestbook',
    authenticate,
    (req, res) => commentHandler.index(req, res)
  );

  router.post('/register-comment',
    authenticate,
    validate,
    (req, res) => commentHandler.registerComment(req, res)
  );

  router.post('/register-comment-api',
    authenticate,
    (req, res) => commentHandler.registerCommentApi(req, res)
  );

  router.get('/latest-comment-api',
    authenticate,
    (req, res) => commentHandler.latestCommentApi(req, res)
  );

  router.use(static('public'));

  return router;
};

module.exports = { setRoutes };