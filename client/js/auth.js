document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(true);
    
    try {
        // Collect form data
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Make API call
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        // Handle response
        const data = await response.json();
        
        if (response.ok) {
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
