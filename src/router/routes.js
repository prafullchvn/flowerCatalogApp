const { Router } = require('server-using-http-module');

/*
{'/':indexHandler}
*/

const { notFound, fileHandler } = require('../handler/defaultHandler.js');

const pagesHandler = require('../handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower } = pagesHandler;

const guestbookHandler = require('../handler/guestbookHandler.js');
const { GuestbookHandler, validate } = guestbookHandler;

const { addTimestamp } = require('../middleware/addTimestamp.js');
const { GuestBook } = require('../model/comment.js');
const { parsePostParams } = require('../middleware/paramsParser.js');

//auth handler
const { login, handleLogin, logout, signup, handleSignUp, } = require('../handler/authHandler.js');
const { injectCookies, authenticate, checkAuth, injectUser } = require('../middleware/authMiddleware.js');

const Session = require('../session.js');

const setRoutes = (config) => {
  const router = new Router();

  router.addDefaultHandler(fileHandler);
  router.addDefaultHandler(notFound);

  router.addMiddleware(addTimestamp);
  router.addMiddleware(injectCookies);

  //injecting session
  const session = new Session();
  router.addMiddleware((req) => { req.session = session });
  router.addMiddleware(injectUser);
  // router.addMiddleware((req) => {
  //   console.log(req, req.cookies, req.url, req.session);
  // });


  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);
  router.post('/uploadFile', parsePostParams, pagesHandler.uploadFile);

  router.get('/login', checkAuth, login);
  router.post('/login', parsePostParams, handleLogin);
  router.get('/logout', authenticate, logout);

  router.get('/signup', checkAuth, signup);
  router.post('/signup', parsePostParams, handleSignUp);

  const { template, dbFile } = config;
  const guestbook = new GuestBook();
  const commentHandler = new GuestbookHandler(guestbook, template, dbFile);

  router.get('/guestbook',
    authenticate,
    (req, res) => commentHandler.index(req, res)
  );

  router.post('/register-comment',
    authenticate,
    parsePostParams,
    validate,
    (req, res) => commentHandler.registerComment(req, res)
  );

  router.post('/register-comment-api',
    authenticate,
    parsePostParams,
    (req, res) => commentHandler.registerCommentApi(req, res)
  );

  return router;
};

// GET /flower
// GET /anotherFlower

// guestBookRouter.get('/guest-book')
// guestBookRouter.get('/guest-book/comments')
// guestBookRouter.post('/guest-book/comment')

// router.get('/flower')
// router.get('/anotherFlower')
// router.all('/guest-book', guestBookRouter.bind({comments:comments}))
// router.get('/',notFound)



// GET /guest-book
// GET /guest-book/comments
// POST /guest-book/comment

module.exports = { setRoutes };