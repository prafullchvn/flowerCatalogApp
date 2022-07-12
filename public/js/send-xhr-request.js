const sendRequest = (url, method, body, cb) => {
  const xhr = new XMLHttpRequest();
  const METHOD = method;
  const URL = url;

  xhr.open(METHOD, URL);
  xhr.onload = (event) => cb(event, xhr);
  xhr.send(body);
}