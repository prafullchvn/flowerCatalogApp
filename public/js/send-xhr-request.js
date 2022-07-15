const sendRequest = (url, method, body, cb, contentType = 'application/x-www-form-urlencoded') => {
  const xhr = new XMLHttpRequest();
  const METHOD = method;
  const URL = url;

  xhr.open(METHOD, URL);
  xhr.setRequestHeader('content-type', contentType);
  xhr.onload = (event) => cb(event, xhr);
  xhr.send(body);
}