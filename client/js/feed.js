document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', document.getElementById('postContent').value);
    Array.from(document.getElementById('imageUpload').files).forEach(file => {
        formData.append('images', file);
    });

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
    });

    if (response.ok) {
        window.location.href = '/feed.html';
    }
});