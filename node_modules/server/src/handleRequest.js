const { router } = require('./router/routes.js');

const handleRequest = (request, response) => {
  router.routeTo(request, response);
};

module.exports = { handleRequest };