// Registration Handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('username', document.getElementById('username').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('password', document.getElementById('password').value);
  formData.append('avatar', document.getElementById('avatar').files[0]);

  try {
      const response = await fetch('/api/auth/register', {
          method: 'POST',
          body: formData
      });

      const data = await response.json();
      if (response.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = '/profile.html';
      } else {
          showError(data.error || 'Registration failed');
      }
  } catch (err) {
      showError('Network error - please try again');
  }
});

// Shared error function
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => errorDiv.style.display = 'none', 5000);
}