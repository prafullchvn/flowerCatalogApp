const addTimestamp = (req, res, next) => {
  req.timestamp = new Date().toLocaleString();
  next();
};

module.exports = { addTimestamp };