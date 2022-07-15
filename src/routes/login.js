const { Router } = require("express");

const { login, handleLogin, logout } = require('../handler/authHandler.js');
const { checkAuth } = require("../middleware/authMiddleware");

const createLoginRoutes = () => {
  const router = Router();

  router.get('/login', checkAuth, login);
  router.post('/login', handleLogin);
  router.get('/logout', logout);

  return router;
}

module.exports = createLoginRoutes;