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
try {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  console.log('Response status:', response.status); // Add this
  const data = await response.json();
  console.log('Response data:', data); // Add this
  
  // ... rest of your code
} catch (err) {
  console.error('Full error:', err); // Detailed error logging
  alert(`Error: ${err.message}`);
}
