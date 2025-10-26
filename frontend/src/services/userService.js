import api from './api';

const userService = {
    // Get profile
    getProfile: async() => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async(userData) => {
        const response = await api.put('/users/profile', userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Upload avatar
    uploadAvatar: async(file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/users/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Update user in localStorage with new avatar
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && response.data.avatar) {
            user.avatar = response.data.avatar;
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response.data;
    },

    // Get all users (Admin only)
    getAllUsers: async() => {
        const response = await api.get('/users');
        return response.data;
    },

    // Get user by ID (Admin only)
    getUserById: async(id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Delete user
    deleteUser: async(id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // Update user role (Admin only)
    updateUserRole: async(id, role) => {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data;
    },

    // Advanced RBAC APIs
    getAllUsersForManagement: async(params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/users/manage/all?${queryString}`);
        return response.data;
    },

    getUserStats: async() => {
        const response = await api.get('/users/manage/stats');
        return response.data;
    },

    updateUserRoleAdvanced: async(id, role) => {
        const response = await api.put(`/users/manage/${id}/role`, { role });
        return response.data;
    },
};

export default userService;