module.exports = (req, res, next) => {
  req.rootDir = './public';
  next();
}