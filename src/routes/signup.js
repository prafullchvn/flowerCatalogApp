const { Router } = require("express");

const { signup, handleSignUp } = require("../handler/authHandler");
const { checkAuth } = require("../middleware/authMiddleware");

const createSignupRoutes = () => {
  const router = Router();

  router.get('/signup', checkAuth, signup);
  router.post('/signup', handleSignUp);

  return router;
}

module.exports = createSignupRoutes;
