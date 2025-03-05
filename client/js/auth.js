document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(true);

    try {
        // Collect form data
        const userData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value.trim()
        };

        // API request to backend
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        // Check if response is valid JSON
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error('Invalid server response');
        }

        if (response.ok) {
            window.location.href = `verify.html?email=${encodeURIComponent(data.email)}`;
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        showError(error.message || 'Network error - please check your connection');
    } finally {
        showLoader(false);
    }
});
