const addRow = ({ name, timestamp, comment }) => {
  const tbody = document.querySelector('.comment-table tbody');
  const row = document.createElement('tr');
  row.innerHTML = `<td>${timestamp}</td><td>${name}</td><td>${comment}</td>`;

  tbody.prepend(row);
}

const handleResponse = (event, xhr, form) => {
  if (xhr.status === 200) {
    addRow(JSON.parse(xhr.responseText));
    form.reset();
    return;
  }

  alert('Error in submitting comment');
}

const submitComment = () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);
  const searchParams = new URLSearchParams(formData);
  const body = searchParams.toString();

  if (searchParams.get('comment') === '') {
    alert('Please enter the comment.');
    return;
  }

  const xhr = new XMLHttpRequest();
  const METHOD = 'POST';
  const URL = '/register-comment-api';

  xhr.open(METHOD, URL);
  xhr.onload = (event) => handleResponse(event, xhr, form);
  xhr.send(body);
}

const main = () => {
  const button = document.querySelector('button');
  button.onclick = () => submitComment();
}

window.onload = main;