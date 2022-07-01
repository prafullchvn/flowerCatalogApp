const { Router } = require('server-using-http-module');

const { notFound, fileHandler } = require('../handler/defaultHandler.js');

const pagesHandler = require('../handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower } = pagesHandler;

const commentHandler = require('../handler/commentHandler.js');
const { CommentHandler, createCommentAdder, validate } = commentHandler;

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
  const commentHandler = new CommentHandler(guestbook, template, dbFile);

  router.get('/guestbook', (req, res) => commentHandler.index(req, res));
  router.post(
    '/register-comment',
    parsePostParams,
    validate,
    (req, res) => commentHandler.registerComment(req, res)
  );

  return router;
};

module.exports = { setRoutes };