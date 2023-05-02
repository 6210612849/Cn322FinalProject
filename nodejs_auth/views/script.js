const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  fetch('/login', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      alert('Login successful');
    } else {
      alert('Invalid credentials');
    }
  })
  .catch(error => {
    console.error(error);
  });
});