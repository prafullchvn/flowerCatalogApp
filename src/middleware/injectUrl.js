module.exports = (req, res, next) => {
  const url = new URL(req.url, `https://${req.headers.host}/`);
  req.myUrlObj = url;
  next();
}
