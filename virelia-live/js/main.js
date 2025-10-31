// Virelia Main Application JavaScript
class VireliaApp {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.isLoading = false;
        this.currentPage = 1;
        this.hasMorePosts = true;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.checkAuthentication();
        this.loadUserData();
        this.setupServiceWorker();
    }

    initializeEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
            });
        }

        if (closeMenu) {
            closeMenu.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        }

        // Feed filters
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilterChange(btn.dataset.filter));
        });

        // Load more posts
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }

        // User menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async checkAuthentication() {
        try {
            const token = localStorage.getItem('virelia_token');
            if (token) {
                const response = await fetch('/api/auth/verify.php', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    this.currentUser = userData;
                    this.updateUIForLoggedInUser();
                } else {
                    this.handleLogout();
                }
            } else {
                this.updateUIForGuest();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.updateUIForGuest();
        }
    }

    updateUIForLoggedInUser() {
        // Update user avatar and name
        const userAvatar = document.getElementById('userAvatar');
        const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
        const sidebarUserName = document.getElementById('sidebarUserAvatar');
        const mobileUserName = document.getElementById('mobileUserName');

        if (userAvatar) {
            userAvatar.innerHTML = `<img src="${this.currentUser.avatar || 'assets/images/default-avatar.jpg'}" alt="${this.currentUser.name}">`;
        }

        if (sidebarUserAvatar) {
            sidebarUserAvatar.innerHTML = `<img src="${this.currentUser.avatar || 'assets/images/default-avatar.jpg'}" alt="${this.currentUser.name}">`;
        }

        if (sidebarUserName) {
            sidebarUserName.textContent = this.currentUser.name;
        }

        if (mobileUserName) {
            mobileUserName.textContent = this.currentUser.name;
        }

        // Show create post button and user menu
        const createPostBtn = document.querySelector('.create-post-btn');
        const userMenu = document.querySelector('.user-menu');
        
        if (createPostBtn) createPostBtn.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'block';

        // Hide join button
        const joinBtn = document.querySelector('.btn-primary');
        if (joinBtn) joinBtn.style.display = 'none';
    }

    updateUIForGuest() {
        // Show guest UI elements
        const joinBtn = document.querySelector('.btn-primary');
        if (joinBtn) joinBtn.style.display = 'block';

        // Hide user-specific elements
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.style.display = 'none';
    }

    async handleSearch(query) {
        if (!query || query.length < 2) {
            this.hideSearchResults();
            return;
        }

        try {
            const response = await fetch(`/api/search.php?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-type="${result.type}" data-id="${result.id}">
                    <div class="search-result-avatar">
                        <img src="${result.avatar}" alt="${result.name}">
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-name">${result.name}</div>
                        <div class="search-result-handle">${result.handle}</div>
                    </div>
                </div>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    async handleFilterChange(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Reload feed with new filter
        this.currentPage = 1;
        this.posts = [];
        await this.loadFeed(filter);
    }

    async loadFeed(filter = 'all') {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const response = await fetch(`/api/feed.php?page=${this.currentPage}&filter=${filter}`);
            const data = await response.json();

            if (data.success) {
                this.posts = [...this.posts, ...data.posts];
                this.hasMorePosts = data.hasMore;
                this.displayPosts();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Failed to load feed:', error);
            this.showError('Failed to load posts');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async loadMorePosts() {
        if (this.isLoading || !this.hasMorePosts) return;

        this.currentPage++;
        await this.loadFeed();
    }

    displayPosts() {
        const postsContainer = document.getElementById('postsContainer');
        if (!postsContainer) return;

        if (this.currentPage === 1) {
            postsContainer.innerHTML = '';
        }

        this.posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsContainer.appendChild(postElement);
        });

        // Update load more button visibility
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = this.hasMorePosts ? 'block' : 'none';
        }
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-card fade-in';
        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${post.user_avatar}" alt="${post.user_name}" class="user-avatar">
                <div class="post-user-info">
                    <div class="post-user-name">${post.user_name}</div>
                    <div class="post-user-handle">@${post.user_handle}</div>
                </div>
                <div class="post-time">${this.formatTime(post.created_at)}</div>
            </div>
            <div class="post-content">
                <div class="post-text">${this.formatPostText(post.content)}</div>
                ${post.media ? this.createMediaElement(post.media) : ''}
            </div>
            <div class="post-stats">
                <div class="post-stat">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes_count}</span>
                </div>
                <div class="post-stat">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments_count}</span>
                </div>
                <div class="post-stat">
                    <i class="fas fa-share"></i>
                    <span>${post.shares_count}</span>
                </div>
            </div>
            <div class="post-actions">
                <button class="post-action-btn like-btn ${post.user_liked ? 'liked' : ''}" 
                        onclick="vireliaApp.handleLike('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span>Like</span>
                </button>
                <button class="post-action-btn" onclick="vireliaApp.handleComment('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span>Comment</span>
                </button>
                <button class="post-action-btn" onclick="vireliaApp.handleShare('${post.id}')">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>
        `;
        return postDiv;
    }

    formatPostText(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert hashtags
        text = text.replace(/#(\w+)/g, '<a href="/hashtag/$1" class="hashtag">#$1</a>');
        
        // Convert mentions
        text = text.replace(/@(\w+)/g, '<a href="/user/$1" class="mention">@$1</a>');
        
        return text;
    }

    createMediaElement(media) {
        if (media.type === 'image') {
            return `<div class="post-media"><img src="${media.url}" alt="Post image"></div>`;
        } else if (media.type === 'video') {
            return `
                <div class="post-media">
                    <video controls>
                        <source src="${media.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }
        return '';
    }

    formatTime(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diff = now - postTime;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return postTime.toLocaleDateString();
    }

    async handleLike(postId) {
        if (!this.currentUser) {
            this.showLoginPrompt();
            return;
        }

        try {
            const response = await fetch('/api/posts/like.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('virelia_token')}`
                },
                body: JSON.stringify({ post_id: postId })
            });

            const data = await response.json();
            
            if (data.success) {
                this.updatePostLikeUI(postId, data.liked);
            }
        } catch (error) {
            console.error('Like action failed:', error);
        }
    }

    updatePostLikeUI(postId, liked) {
        const likeBtn = document.querySelector(`.like-btn[onclick*="${postId}"]`);
        if (likeBtn) {
            likeBtn.classList.toggle('liked', liked);
            const likeCount = likeBtn.closest('.post-card').querySelector('.fa-heart').nextElementSibling;
            if (likeCount) {
                const currentCount = parseInt(likeCount.textContent);
                likeCount.textContent = liked ? currentCount + 1 : currentCount - 1;
            }
        }
    }

    handleComment(postId) {
        // Implement comment functionality
        console.log('Comment on post:', postId);
    }

    handleShare(postId) {
        // Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post on Virelia',
                url: `${window.location.origin}/post/${postId}`
            });
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
            this.showToast('Link copied to clipboard!');
        }
    }

    showLoading() {
        const postsContainer = document.getElementById('postsContainer');
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Loading posts...</span>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading state is handled in displayPosts
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    showLoginPrompt() {
        if (confirm('You need to be logged in to perform this action. Would you like to login now?')) {
            window.location.href = '/login.html';
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const response = await fetch('/api/user/stats.php', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('virelia_token')}`
                }
            });
            
            if (response.ok) {
                const stats = await response.json();
                this.updateUserStats(stats);
            }
        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    }

    updateUserStats(stats) {
        const postCount = document.getElementById('postCount');
        const followerCount = document.getElementById('followerCount');
        const followingCount = document.getElementById('followingCount');

        if (postCount) postCount.textContent = stats.posts || '0';
        if (followerCount) followerCount.textContent = stats.followers || '0';
        if (followingCount) followingCount.textContent = stats.following || '0';
    }

    async updatePlatformStats() {
        try {
            const response = await fetch('/api/stats/platform.php');
            if (response.ok) {
                const stats = await response.json();
                
                const totalUsers = document.getElementById('totalUsers');
                const totalPosts = document.getElementById('totalPosts');
                const onlineUsers = document.getElementById('onlineUsers');

                if (totalUsers) totalUsers.textContent = this.formatNumber(stats.totalUsers);
                if (totalPosts) totalPosts.textContent = this.formatNumber(stats.totalPosts);
                if (onlineUsers) onlineUsers.textContent = this.formatNumber(stats.onlineUsers);
            }
        } catch (error) {
            console.error('Failed to load platform stats:', error);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Initialize the application
const vireliaApp = new VireliaApp();

// Global functions for HTML onclick handlers
function logout() {
    localStorage.removeItem('virelia_token');
    window.location.href = '/';
}

function initializeApp() {
    // Additional initialization if needed
    console.log('Virelia app initialized');
}

function loadFeed() {
    vireliaApp.loadFeed();
}

function updatePlatformStats() {
    vireliaApp.updatePlatformStats();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VireliaApp, vireliaApp };
}
