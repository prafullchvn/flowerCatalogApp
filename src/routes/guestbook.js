const { Router } = require("express");
const { validate, GuestbookHandler } = require("../handler/guestbookHandler");
const { authenticate } = require("../middleware/authMiddleware");
const { GuestBook } = require("../model/comment");

const createGuestbookRoutes = ({ template, dbFile }) => {
  const router = Router();
  const guestbook = new GuestBook();
  const commentHandler = new GuestbookHandler(guestbook, template, dbFile);

  router.get('/guestbook',
    authenticate,
    (req, res) => commentHandler.index(req, res)
  );

  router.post('/register-comment',
    authenticate,
    validate,
    (req, res) => commentHandler.registerComment(req, res)
  );

  router.post('/register-comment-api',
    authenticate,
    (req, res) => commentHandler.registerCommentApi(req, res)
  );

  router.get('/latest-comment-api',
    authenticate,
    (req, res) => commentHandler.latestCommentApi(req, res)
  );

  return router;
};

module.exports = createGuestbookRoutes;