const { notFound, fileHandler } = require('../handler/defaultHandler.js');
const { index, abelioFlower, ageratumFlower, guestBook, registerComment } = require('../handler/pagesHandler.js');
const { Router } = require('./router.js');

const setRoutes = () => {
  const router = new Router();

  router.addFallbackHandler(fileHandler);
  router.addFallbackHandler(notFound);

  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);
  router.get('/guestbook', guestBook);
  router.get('/register-comment', registerComment);


  return router;
};

module.exports = { router: setRoutes() };