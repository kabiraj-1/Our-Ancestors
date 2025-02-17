document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const token = new URLSearchParams(window.location.search).get('token');

    try {
        const response = await fetch(`/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        });

        if (response.ok) {
            alert('Password reset successful!');
            window.location.href = '/auth/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});