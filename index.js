const { router } = require('./src/router/routes.js');
const { startServer } = require('server-using-http-module');

const PORT = 80;
startServer(PORT, router);
