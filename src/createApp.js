const express = require('express');

const { addTimestamp } = require('./middleware/addTimestamp.js');
const auth = require('./middleware/authMiddleware.js');
const { injectUser } = auth;
const injectCookies = require('./middleware/injectCookies.js');
const injectRootDir = require('./middleware/injectRootDir.js');
const injectUrl = require('./middleware/injectUrl.js');

const createGuestbookRoutes = require('./routes/guestbook.js');
const createLoginRoutes = require('./routes/login.js');
const createSignupRoutes = require('./routes/signup.js');
const createStaticRoutes = require('./routes/static.js');

const createApp = (config, session, fs) => {
  const app = express();

  app.use(addTimestamp);
  app.use(injectCookies);
  app.use((req, res, next) => {
    req.session = session;
    next();
  });
  app.use(injectUser);
  app.use(express.urlencoded({ extended: true }));
  app.use(injectRootDir);
  app.use(injectUrl);

  app.use(createStaticRoutes());
  app.use(createLoginRoutes());
  app.use(createSignupRoutes());
  app.use(createGuestbookRoutes(config, fs));

  app.use(express.static('public'));
  return app;
};

module.exports = { createApp };

