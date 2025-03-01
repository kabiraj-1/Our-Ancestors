// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('profilePic', document.getElementById('profilePic').files[0]);

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user._id);
            window.location.href = '/feed.html';
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        showError('Network error - please try again later');
    }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user._id);
            window.location.href = '/feed.html';
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        showError('Network error - please try again later');
    }
});

// Error handling function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.auth-container');
    container.prepend(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// File upload label text update
document.getElementById('profilePic')?.addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'Upload Profile Picture';
    document.getElementById('fileText').textContent = fileName;
});
