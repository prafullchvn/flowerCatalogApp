const { createApp } = require("./src/createApp.js");
const Session = require('./src/session.js');
const fs = require('fs');

const config = {
  template: './src/resource/guestBook.html',
  dbFile: './src/resource/comments.json'
};

const PORT = 8080;

const app = createApp(config, new Session(), fs);
app.listen(PORT, () => console.log('server started on ' + PORT));
