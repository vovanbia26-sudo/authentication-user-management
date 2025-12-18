import React, { useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import './AvatarUpload.css';

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }) => {
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const validateFile = (file) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Chỉ chấp nhận file JPEG, PNG, hoặc WebP');
            return false;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 10MB');
            return false;
        }

        return true;
    };

    const handleFileSelect = (file) => {
        if (validateFile(file)) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!avatarFile) {
            toast.error('Vui lòng chọn một hình ảnh');
            return;
        }

        setUploading(true);
        try {
            const response = await userService.uploadAvatar(avatarFile);
            toast.success('Avatar đã được cập nhật thành công!');
            
            // Update parent component
            if (onAvatarUpdate) {
                onAvatarUpdate(response.avatar);
            }

            // Reset form
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi khi tải lên avatar';
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
    };

    return (
        <div className="avatar-upload">
            <div className="avatar-current">
                <img 
                    src={currentAvatar || 'https://via.placeholder.com/150?text=Avatar'} 
                    alt="Current Avatar"
                    className="avatar-image"
                />
                <h4>Avatar hiện tại</h4>
            </div>

            <div 
                className={`avatar-dropzone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {avatarPreview ? (
                    <div className="avatar-preview">
                        <img src={avatarPreview} alt="Preview" className="preview-image" />
                        <p>Preview - Sẽ được resize thành 300x300px</p>
                    </div>
                ) : (
                    <div className="dropzone-content">
                        <div className="upload-icon">📸</div>
                        <p>Kéo thả ảnh vào đây hoặc</p>
                        <label className="file-input-label">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            Chọn file
                        </label>
                        <small>Chấp nhận: JPEG, PNG, WebP (tối đa 10MB)</small>
                    </div>
                )}
            </div>

            {avatarFile && (
                <div className="upload-actions">
                    <button 
                        onClick={handleUpload} 
                        disabled={uploading}
                        className="btn-upload"
                    >
                        {uploading ? 'Đang tải lên...' : 'Tải lên Avatar'}
                    </button>
                    <button 
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={uploading}
                    >
                        Hủy
                    </button>
                </div>
            )}

            <div className="upload-info">
                <h5>🔧 Tính năng nâng cao:</h5>
                <ul>
                    <li>✅ Tự động resize thành 300x300px</li>
                    <li>✅ Tối ưu chất lượng JPEG (90%)</li>
                    <li>✅ Upload lên Cloudinary CDN</li>
                    <li>✅ Hỗ trợ kéo thả file</li>
                    <li>✅ Validation file type & size</li>
                </ul>
            </div>
        </div>
    );
};

export default AvatarUpload;
