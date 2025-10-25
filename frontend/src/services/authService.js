import api from './api';

const authService = {
    // Sign up
    signup: async(userData) => {
        const response = await api.post('/auth/signup', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Login
    login: async(credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Logout
    logout: async() => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Forgot password
    forgotPassword: async(email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async(token, password) => {
        const response = await api.put(`/auth/reset-password/${token}`, { password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    },
};

export default authService;