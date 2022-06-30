const addTimestamp = (req, res) => {
  req.timestamp = new Date().toLocaleString();
};

module.exports = { addTimestamp };