const { createServer } = require('net');
const { parseRequest } = require('./requestParser.js');
const { Response } = require('./response.js');

const processRequest = (requestAsString, requestHandler, socket, rootDir) => {
  const response = new Response(socket);
  const request = parseRequest(requestAsString);
  request.rootDir = rootDir
  requestHandler(request, response);
};

const startServer = (port, requestHandler, rootDir = './public') => {
  const server = createServer((socket) => {
    console.log('connection received');
    socket.setTimeout(5000);
    socket.setEncoding('utf8');

    socket.on('data', (request) =>
      processRequest(request, requestHandler, socket, rootDir)
    );

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

module.exports = { startServer, processRequest };
