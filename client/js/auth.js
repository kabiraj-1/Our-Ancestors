// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(true);
    
    try {
        const formData = new FormData();
        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('password', document.getElementById('password').value);
        formData.append('profilePic', document.getElementById('profilePic').files[0]);

        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            // Redirect to verification page
            window.location.href = `verify.html?email=${encodeURIComponent(data.email)}`;
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        showError('Network error - please check your connection');
    } finally {
        showLoader(false);
    }
});

// Handle Verification
document.getElementById('verifyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(true);
    
    try {
        const verificationCode = document.getElementById('verificationCode').value;
        const email = new URLSearchParams(window.location.search).get('email');

        const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code: verificationCode })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/feed.html';
        } else {
            showError(data.message || 'Verification failed');
        }
    } catch (error) {
        showError('Network error - please try again');
    } finally {
        showLoader(false);
    }
});

// Utility functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.auth-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = show ? 'block' : 'none';
}
