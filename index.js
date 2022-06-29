// const { startServer } = require('server');
// const { router } = require('./src/router/routes.js');
// startServer(80, router);

const http = require('http');
const { createHandler } = require('./src/handler/main');

const rootDir = process.argv[2];
const server = http.createServer(createHandler(rootDir));

server.listen(80, () => {
  console.log('Connected to server on port', server.address().port);
})



