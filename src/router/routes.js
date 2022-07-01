const { Router } = require('server-using-http-module');

const { notFound, fileHandler } = require('../handler/defaultHandler.js');

const pagesHandler = require('../handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower } = pagesHandler;

const commentHandler = require('../handler/commentHandler.js');
const { showGuestBook, createCommentAdder, validate } = commentHandler;

const { addTimestamp } = require('../middleware/addTimestamp.js');

const setRoutes = (config) => {
  const router = new Router();

  router.addDefaultHandler(fileHandler);
  router.addDefaultHandler(notFound);

  router.addMiddleware(addTimestamp);
  router.addMiddleware(addTimestamp);

  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);
  router.get('/guestbook', showGuestBook(config));
  router.get('/register-comment', validate, createCommentAdder(config));

  return router;
};

module.exports = { setRoutes };