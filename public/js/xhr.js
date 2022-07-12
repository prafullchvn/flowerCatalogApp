const insertComments = comments => {
  const tbody = document.querySelector('.comment-table tbody');
  comments.forEach(({ id, comment, name, timestamp }) => {
    const tr = document.createElement('tr');
    tr.id = id;
    tr.innerHTML = `<td>${timestamp}</td><td>${name}</td><td>${comment}</td>`;
    tbody.prepend(tr);
  });
}

const getLatestId = () => {
  const tbody = document.querySelector('.comment-table tbody');
  return tbody.getElementsByTagName('tr')[0].id;
}

const fetchLatestComments = () => {
  const latestId = getLatestId();
  sendRequest(`/latest-comment-api?id=${latestId}`, 'GET', '', (event, xhr) => {
    insertComments(JSON.parse(xhr.response));
  });
}

const handleResponse = (event, xhr) => {
  const form = document.querySelector('form');

  if (xhr.status === 200) {
    fetchLatestComments(JSON.parse(xhr.responseText));
    form.reset();
    return;
  }

  alert('Error in submitting comment');
}

const submitComment = (event) => {
  const form = event.target;
  const formData = new FormData(form);
  const searchParams = new URLSearchParams(formData);
  const body = searchParams.toString();

  if (searchParams.get('comment') === '') {
    alert('Please enter the comment.');
    return;
  }

  sendRequest('/register-comment-api', 'POST', body, handleResponse)
  event.preventDefault();
}

const main = () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', submitComment);
}

window.onload = main;