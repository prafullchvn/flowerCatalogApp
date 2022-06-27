const { startServer } = require('./src/server');
const { handleRequest } = require('./src/handleRequest.js')

startServer(80, handleRequest);
