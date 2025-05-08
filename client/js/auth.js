document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle validation errors
      if (data.errors) {
        Object.keys(data.errors).forEach(field => {
          const input = document.getElementById(field);
          input.classList.add('error');
          input.nextElementSibling.textContent = data.errors[field];
        });
        return;
      }
      
      // Handle existing user error
      if (data.error === 'User already exists') {
        if (data.fields.email) {
          document.getElementById('email').classList.add('error');
          document.getElementById('emailError').textContent = 'Email already in use';
        }
        if (data.fields.username) {
          document.getElementById('username').classList.add('error');
          document.getElementById('usernameError').textContent = 'Username taken';
        }
        return;
      }
      
      throw new Error(data.error || 'Registration failed');
    }

    // Success handling
    localStorage.setItem('token', data.token);
    window.location.href = '/feed.html';
  } catch (error) {
    showErrorAlert(error.message);
  }
});

function showErrorAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert error';
  alertDiv.textContent = message;
  document.body.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}
