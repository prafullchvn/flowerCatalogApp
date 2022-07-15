const Session = require('../session.js');
const session = new Session();

module.exports = (req, res, next) => {
  req.session = session;
  next();
}