const api = 'http://localhost:4000/api/auth';

async function registerUser() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${api}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  alert(data.msg || data.message);
  if (res.ok) window.location.href = 'verify.html';
}

async function verifyOtp() {
  const email = document.getElementById('email').value;
  const otp = document.getElementById('otp').value;
  const res = await fetch(`${api}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    alert('Verified and logged in');
    window.location.href = '../feed.html';
  } else {
    alert(data.msg || data.message);
  }
}

async function loginUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${api}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    alert('Login successful');
    window.location.href = '../feed.html';
  } else {
    alert(data.msg || data.message);
  }
}
