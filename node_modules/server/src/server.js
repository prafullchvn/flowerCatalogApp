const { createServer } = require('net');
const { parseRequest } = require('./requestParser.js');
const { Response } = require('./response.js');
const { Router } = require('./router/router.js');

const startServer = (port, router, rootDir = './public') => {
  const server = createServer((socket) => {
    console.log('connection received');
    socket.setTimeout(5000);
    socket.setEncoding('utf8');

    socket.on('data', (requestAsString) => {
      const request = parseRequest(requestAsString);
      const response = new Response(socket);
      request.rootDir = rootDir;
      router.routeTo(request, response);
    });

    socket.on('timeout', () => {
      socket.destroy();
    });

    socket.on('error', err => {
      console.log(err.stack);
    });

    socket.on('close', () => {
      console.log('Connection closed.')
    });
  });

  server.listen(port, () => {
    console.log(`Started listening on ${port}.`)
    console.log('Root dir is', rootDir);
  });

};

module.exports = { startServer };
