// Auth Functions
const API_BASE = 'http://localhost:5000/api/auth';

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/feed.html';
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Connection error');
  }
});
