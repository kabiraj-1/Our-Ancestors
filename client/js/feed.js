document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = '/auth/login.html';

  try {
    const response = await fetch('/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const posts = await response.json();
    // Render posts...
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
});
