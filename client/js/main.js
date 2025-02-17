document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = document.getElementById('postContent').value;
    const files = document.getElementById('imageUpload').files;
    
    const formData = new FormData();
    formData.append('content', content);
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            window.location.href = '/feed.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Image preview functionality
document.getElementById('imageUpload').addEventListener('change', function() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    for (const file of this.files) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.height = 100;
        preview.appendChild(img);
    }
});