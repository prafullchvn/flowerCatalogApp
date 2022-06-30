const determineFileType = (extension) => {
  const types = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.css': 'text/css'
  };

  return types[extension] || 'text/html';
};

const setContentType = (req, res) => {
  const { pathname } = req.url;
  res.setHeader('content-type', determineFileType(pathname));
};

module.exports = { setContentType };