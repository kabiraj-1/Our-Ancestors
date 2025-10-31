// Authentication functions
class Auth {
    static async login(email, password) {
        try {
            const response = await fetch('/api/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('virelia_token', data.token);
                localStorage.setItem('virelia_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    }

    static async register(name, email, password, username) {
        try {
            const response = await fetch('/api/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, username })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('virelia_token', data.token);
                localStorage.setItem('virelia_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'An error occurred during registration' };
        }
    }

    static logout() {
        localStorage.removeItem('virelia_token');
        localStorage.removeItem('virelia_user');
        window.location.href = '/';
    }

    static getCurrentUser() {
        const user = localStorage.getItem('virelia_user');
        return user ? JSON.parse(user) : null;
    }

    static isLoggedIn() {
        return !!localStorage.getItem('virelia_token');
    }

    static getToken() {
        return localStorage.getItem('virelia_token');
    }
}
