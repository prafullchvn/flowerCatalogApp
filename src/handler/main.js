const { router } = require('../router/routes.js');

const createHandler = (rootDir = './public') => (req, res) => {
  req.rootDir = rootDir;
  const url = new URL(req.url, `https://${req.headers.host}/`);
  req.url = url;
  router.routeTo(req, res);
}

module.exports = { createHandler };
