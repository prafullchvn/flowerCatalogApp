const { setRoutes } = require('./src/router/routes.js');
const { startServer } = require('server-using-http-module');

const PORT = 80;
const config = {
  template: './src/resource/guestBook.html',
  dbFile: './src/resource/comments.json'
};


startServer(PORT, setRoutes(config));
