(function () {

  const handleFormSubmit = event => {
    const form = document.querySelector('form');
    const formData = new FormData(form);

    sendRequest('/uploadFile', 'POST', formData, (event, xhr) => {

      if (xhr.status === 200) {
        alert('uploaded successfully')
        return;
      }

      alert('error in uploading');
    });


    event.preventDefault();
  }

  const main = () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
  }

  window.onload = main;

})()