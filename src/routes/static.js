const { Router } = require('express');

const pagesHandler = require('../handler/pagesHandler.js');
const { index, abelioFlower, ageratumFlower, uploadFile } = pagesHandler;

const createStaticRoutes = () => {
  const router = Router();

  router.get('/', index);
  router.get('/index', index);
  router.get('/abelio', abelioFlower);
  router.get('/ageratum', ageratumFlower);
  router.post('/uploadFile', uploadFile);

  return router
}

module.exports = createStaticRoutes;
