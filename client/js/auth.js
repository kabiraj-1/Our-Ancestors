document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    });

    if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user._id);
        window.location.href = '/feed.html';
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('profilePic', document.getElementById('profilePic').files[0]);

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user._id);
        window.location.href = '/feed.html';
    }
});