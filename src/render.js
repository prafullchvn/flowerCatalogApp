const fs = require('fs');

const render = (template, dataToBeRendered, callback) => {
  fs.readFile(template, 'utf8', (err, content) => {

    const html = Object.entries(dataToBeRendered).reduce(
      (renderedHtml, [field, value]) => {
        const placeholder = '@' + field;

        return renderedHtml.replace(placeholder, value);
      }, content);

    callback(html);
  });
};

module.exports = render