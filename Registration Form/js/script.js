const form = document.getElementById('regForm');
const message = document.getElementById('message');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    message.textContent = 'Passwords do not match.';
    message.style.color = 'red';
    return;
  }

  // Here you would typically make an AJAX request to your server to handle the registration.
  // For this example, we'll just display a success message.
  message.textContent = 'Registration successful!';
  message.style.color = 'green';
  form.reset();
});