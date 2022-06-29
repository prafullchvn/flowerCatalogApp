const { startServer } = require('server');
const { router } = require('./src/router/routes.js');

startServer(80, router);
