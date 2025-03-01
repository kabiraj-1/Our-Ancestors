// Registration Handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(true);
    
    try {
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.href = `verify.html?email=${encodeURIComponent(userData.email)}`;
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        showError('Network error - please check your connection');
    } finally {
        showLoader(false);
    }
});

// Verification Handler
document.getElementById('verifyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(true);
    
    try {
        const otp = document.getElementById('otp').value;
        const email = new URLSearchParams(window.location.search).get('email');

        const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html';
        } else {
            showError(data.message || 'Verification failed');
        }
    } catch (error) {
        showError('Network error - please try again');
    } finally {
        showLoader(false);
    }
});

// Resend OTP Handler
document.getElementById('resendOtp')?.addEventListener('click', async (e) => {
    e.preventDefault();
    showLoader(true);
    
    try {
        const email = new URLSearchParams(window.location.search).get('email');
        const response = await fetch('http://localhost:3000/api/auth/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (!response.ok) {
            showError(data.message || 'Failed to resend OTP');
        } else {
            startCountdown();
            showError('New OTP sent successfully!', 'success');
        }
    } catch (error) {
        showError('Network error - please try again');
    } finally {
        showLoader(false);
    }
});

// Utility Functions
function showError(message, type = 'error') {
    const errorDiv = document.createElement('div');
    errorDiv.className = `alert ${type}`;
    errorDiv.textContent = message;
    document.querySelector('.auth-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = show ? 'block' : 'none';
}

// Countdown Timer
function startCountdown(duration = 60) {
    let timer = duration;
    const countdownElement = document.getElementById('countdown');
    const resendLink = document.getElementById('resendOtp');
    
    resendLink.style.display = 'none';
    countdownElement.textContent = ` (${timer}s)`;

    const interval = setInterval(() => {
        timer--;
        countdownElement.textContent = ` (${timer}s)`;
        
        if (timer <= 0) {
            clearInterval(interval);
            resendLink.style.display = 'inline';
            countdownElement.textContent = '';
        }
    }, 1000);
}

// Initialize countdown on verify page load
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('verify.html')) {
        startCountdown();
    }
});
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
            body: formData,
            headers: {
                // Don't set Content-Type header for FormData
                // Browser will set it automatically with boundary
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        window.location.href = `verify.html?email=${encodeURIComponent(data.email)}`;
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message || 'Network error - please check your connection');
    } finally {
        showLoader(false);
    }
});
