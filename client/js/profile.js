document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.ok) {
        const user = await response.json();
        document.getElementById('profileInfo').innerHTML = `
            <p>Username: ${user.username}</p>
            <p>Email: ${user.email}</p>
            <img src="${user.profilePicture}" alt="Profile Picture">
        `;
    }
});