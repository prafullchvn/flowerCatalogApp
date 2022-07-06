const { Router } = require('server-using-http-module');

const { notFound, fileHandler } = require('../handler/defaultHandler.js');

const pagesHandler = require('../handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower } = pagesHandler;

const guestbookHandler = require('../handler/guestbookHandler.js');
const { GuestbookHandler, validate } = guestbookHandler;

const { addTimestamp } = require('../middleware/addTimestamp.js');
const { GuestBook } = require('../model/comment.js');
const { parsePostParams } = require('../middleware/paramsParser.js');

const setRoutes = (config) => {
  const router = new Router();

  router.addDefaultHandler(fileHandler);
  router.addDefaultHandler(notFound);

  router.addMiddleware(addTimestamp);

  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);


  const { template, dbFile } = config;
  const guestbook = new GuestBook();
  const commentHandler = new GuestbookHandler(guestbook, template, dbFile);

  router.get('/guestbook', (req, res) => commentHandler.index(req, res));
  router.post('/register-comment',
    parsePostParams,
    validate,
    (req, res) => commentHandler.registerComment(req, res)
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