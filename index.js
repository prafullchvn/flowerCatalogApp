const { router } = require('./src/router/routes.js');
const { startServer } = require('server-using-http-module');

const PORT = 80;
const rootDir = process.argv[2] || './public';
startServer(PORT, router, rootDir);
