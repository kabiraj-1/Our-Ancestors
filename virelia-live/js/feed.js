// Feed functionality
class Feed {
    static async loadFeed(page = 1, filter = 'all') {
        try {
            const response = await fetch(`/api/feed.php?page=${page}&filter=${filter}`);
            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error loading feed:', error);
            throw error;
        }
    }

    static async createPost(content, mediaType = 'text', mediaUrl = '') {
        try {
            const token = Auth.getToken();
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/posts.php?action=create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content,
                    media_type: mediaType,
                    media_url: mediaUrl
                })
            });

            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    static async likePost(postId) {
        try {
            const token = Auth.getToken();
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/posts.php?action=like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ post_id: postId })
            });

            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    }
}// Feed JS
