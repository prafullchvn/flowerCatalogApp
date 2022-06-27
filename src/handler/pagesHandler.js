const index = (req, res) => {
  res.sendHTML('<h1> this is index page </h1>');
};

module.exports = { index };
