import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, isAdmin, isModerator } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [stats, setStats] = useState(null);
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            setUsers(response.users);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch users';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
            return;
        }

        setDeletingId(userId);
        try {
            await userService.deleteUser(userId);
            setUsers(users.filter((user) => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete user';
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        // Only admin can change roles
        if (!isAdmin) {
            toast.error('Only administrators can change user roles');
            return;
        }

        const roleOptions = ['user', 'moderator', 'admin'];
        const currentIndex = roleOptions.indexOf(currentRole);
        const newRole = roleOptions[(currentIndex + 1) % roleOptions.length];

        if (!window.confirm(`Change role from ${currentRole} to ${newRole}?`)) {
            return;
        }

        try {
            await userService.updateUserRole(userId, newRole);
            setUsers(
                users.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success(`Role updated to ${newRole}`);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update role';
            toast.error(message);
        }
    };

    if (loading) {
        return <Loading message="Loading users..." />;
    }

    return (
        <div className="admin-container">
            <div className="admin-content">
                <div className="admin-header">
                    <h2>Bảng điều khiển Admin</h2>
                    <span className="user-count">Tổng số người dùng: {users.length}</span>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Tham gia</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="user-avatar"
                                        />
                                    </td>
                                    <td className="user-name">{user.name}</td>
                                    <td className="user-email">{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="user-date">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="user-actions">
                                        <button
                                            onClick={() => handleToggleRole(user._id, user.role)}
                                            className="action-button role-button"
                                            title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                                        >
                                            {user.role === 'admin' ? '👤' : '👑'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                            className="action-button delete-button"
                                            disabled={deletingId === user._id}
                                            title="Delete user"
                                        >
                                            {deletingId === user._id ? '⏳' : '🗑️'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="no-users">
                            <p>Không tìm thấy người dùng</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;