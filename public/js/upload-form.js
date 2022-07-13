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
    const dragArea = document.querySelector('.drag-area');

    // ********

    const formData = new FormData();
    const formSubmit = document.getElementById('drop-upload');
    formSubmit.addEventListener('click', () => {
      sendRequest('/uploadFile', 'POST', formData, (e, xhr) => {
        console.log('response sent');

        if (xhr.status === 200) {
          alert('uploaded successfully');
          return
        }
        alert('failed');
      })
    });

    form.addEventListener('submit', handleFormSubmit);

    dragArea.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    dragArea.addEventListener('drop', (event) => {
      const dt = event.dataTransfer;

      [...dt.files].forEach(file => {
        const reader = new FileReader();
        const img = document.createElement('img');

        reader.addEventListener('load', () => {
          img.src = reader.result;
          document.querySelector('.previews').appendChild(img);
          formData.append('images', file, file.name);
        });

        reader.readAsDataURL(file);
      })

      event.preventDefault();
    });
  }

  window.onload = main;

})()