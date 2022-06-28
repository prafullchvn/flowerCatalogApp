const getStatusMessage = (statusCode) => {
  const statuses = {
    200: 'OK',
    404: 'Not Found',
    301: 'redirecting',
    302: 'redirecting'
  };
  return statuses[statusCode];
};

EOL = '\r\n';

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  #statusLine() {
    const statusMessage = getStatusMessage(this.#statusCode);
    return ['HTTP/1.1', this.#statusCode, statusMessage].join(' ') + EOL;
  }

  #write(data) {
    this.#socket.write(data);
  }

  #end() {
    this.#socket.end();
  }

  addHeader(field, value) {
    this.#headers[field] = value;
  }

  #printHeaders() {
    Object.entries(this.#headers).forEach(([field, value]) => {
      this.#write(`${field}: ${value}${EOL}`)
    });
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  sendFile(content) {
    this.addHeader('content-length', content.length);
    this.writeResponse(content);
  }

  sendHTML(html) {
    this.addHeader('content-type', 'text/html');
    this.addHeader('content-length', html.length);

    this.writeResponse(html);
  }

  writeResponse(data) {
    this.#write(this.#statusLine());
    this.#printHeaders();
    this.#write(EOL);
    this.#write(data);
  }

  send(data) {
    this.addHeader('content-type', 'text/plain');
    this.addHeader('content-length', data.length);
    this.writeResponse(data);
  }

  redirect(location) {
    this.#statusCode = 301;
    this.addHeader('location', location);
    this.send('');
  }
}

module.exports = { Response };