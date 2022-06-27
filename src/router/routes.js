const { notFound, fileHandler } = require('../handler/defaultHandler.js');
const { index } = require('../handler/pagesHandler.js');
const { Router } = require('./router.js');

const setRoutes = () => {
  const router = new Router();

  router.addFallbackHandler(fileHandler);
  router.addFallbackHandler(notFound);

  router.get('/', index);


  return router;
};

module.exports = { router: setRoutes() };