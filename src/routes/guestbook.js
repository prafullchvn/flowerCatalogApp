const { Router } = require("express");
const fs = require('fs');

const { GuestbookHandler, createSaver, createLoader } = require("../handler/guestbookHandler");
const { authenticate } = require("../middleware/authMiddleware");
const { Comments } = require("../model/comment");

const createGuestbookRoutes = ({ template, dbFile }, fs) => {
  const router = Router();

  const saveComments = createSaver(dbFile, fs.writeFileSync);
  const loadComments = createLoader(dbFile, fs.readFileSync);

  const comments = new Comments(saveComments, loadComments);
  const guestbookHandler = new GuestbookHandler(comments, template, dbFile);

  router.get('/guestbook',
    authenticate,
    (req, res) => guestbookHandler.index(req, res)
  );

  router.post('/register-comment-api',
    authenticate,
    (req, res) => guestbookHandler.registerCommentApi(req, res)
  );

  router.get('/latest-comment-api',
    authenticate,
    (req, res) => guestbookHandler.latestCommentApi(req, res)
  );

  return router;
};

module.exports = createGuestbookRoutes;