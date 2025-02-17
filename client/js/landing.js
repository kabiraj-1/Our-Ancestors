// Toggle contact info visibility
function toggleContact() {
    const contactInfo = document.getElementById('contact-info');
    contactInfo.style.display = contactInfo.style.display === 'none' ? 'block' : 'none';
}

// Handle password reset
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;

    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Password reset link sent to your email!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});