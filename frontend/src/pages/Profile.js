import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Loading from '../components/Loading';
import AvatarUpload from '../components/AvatarUpload';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if password fields are filled
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
        }
        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
            };
            // Only include password if it's being changed
            if (formData.password) {
                updateData.password = formData.password;
            }
            const response = await userService.updateProfile(updateData);
            updateUser(response.user);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setFormData({
                ...formData,
                password: '',
                confirmPassword: '',
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Loading message="Loading profile..." />;
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <h2>Hồ sơ của tôi</h2>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            Chỉnh sửa hồ sơ
                        </button>
                    )}
                </div>
                <div className="profile-avatar-section">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="profile-avatar"
                    />
                    <button 
                        onClick={() => setShowAvatarUpload(!showAvatarUpload)} 
                        className="avatar-toggle-button"
                    >
                        {showAvatarUpload ? 'Ẩn Upload Avatar' : '📸 Đổi Avatar'}
                    </button>
                </div>

                {showAvatarUpload && (
                    <div className="avatar-upload-section">
                        <AvatarUpload 
                            currentAvatar={user.avatar}
                            onAvatarUpdate={(newAvatar) => {
                                updateUser({ ...user, avatar: newAvatar });
                                setShowAvatarUpload(false);
                            }}
                        />
                    </div>
                )}
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="name">Tên</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu mới (để trống để giữ mật khẩu hiện tại)</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength="6"
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength="6"
                                placeholder="Xác nhận mật khẩu mới"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-button" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: user.name,
                                        email: user.email,
                                        password: '',
                                        confirmPassword: '',
                                    });
                                }}
                                className="cancel-button"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-info">
                        <div className="info-item">
                            <span className="info-label">Tên: </span>
                            <span className="info-value">{user.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email: </span>
                            <span className="info-value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Vai trò: </span>
                            <span className={`info-value role-badge ${user.role}`}>{user.role}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Thành viên từ: </span>
                            <span className="info-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;