import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Loading from '../components/Loading';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) {
            toast.error('Vui lòng chọn một hình ảnh');
            return;
        }
        
        // Kiểm tra kích thước file (5MB)
        if (avatarFile.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
            return;
        }
        
        // Kiểm tra loại file
        if (!avatarFile.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh hợp lệ');
            return;
        }
        
        setLoading(true);
        try {
            const response = await userService.uploadAvatar(avatarFile);
            updateUser({ ...user, avatar: response.avatar });
            toast.success('Avatar đã được cập nhật thành công!');
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error('Upload error:', error);
            const message = error.response?.data?.message || 'Không thể tải lên avatar. Vui lòng kiểm tra cấu hình Cloudinary';
            toast.error(message);
        } finally {
            setLoading(false);
        }
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
                        src={avatarPreview || user.avatar}
                        alt={user.name}
                        className="profile-avatar"
                    />
                    <div className="avatar-upload">
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="avatar" className="avatar-label">
                            Chọn hình ảnh
                        </label>
                        {avatarFile && (
                            <button onClick={handleAvatarUpload} className="upload-button" disabled={loading}>
                                {loading ? 'Đang tải lên...' : 'Tải lên'}
                            </button>
                        )}
                    </div>
                </div>
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