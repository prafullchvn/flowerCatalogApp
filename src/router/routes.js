const { notFound, fileHandler } = require('../handler/defaultHandler.js');
const {
  index,
  abelioFlower,
  ageratumFlower
} = require('../handler/pagesHandler.js');
const { guestBook, registerComment, validate } = require('../handler/commentHandler.js');
const { Router } = require('server');

const setRoutes = () => {
  const router = new Router();

  router.addFallbackHandler(fileHandler);
  router.addFallbackHandler(notFound);

  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);
  router.get('/guestbook', guestBook);
  router.get('/register-comment', validate, registerComment);

  return router;
};

module.exports = { router: setRoutes() };