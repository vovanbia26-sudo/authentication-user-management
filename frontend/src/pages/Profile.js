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

    const handleAvatarUpload = async() => {
        if (!avatarFile) {
            toast.error('Please select an image');
            return;
        }

        setLoading(true);
        try {
            const response = await userService.uploadAvatar(avatarFile);
            updateUser({...user, avatar: response.avatar });
            toast.success('Avatar updated successfully!');
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            const message = error.response ? .data ? .message || 'Failed to upload avatar';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async(e) => {
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
            const message = error.response ? .data ? .message || 'Failed to update profile';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Loading message = "Loading profile..." / > ;
    }

    return ( <
        div className = "profile-container" >
        <
        div className = "profile-content" >
        <
        div className = "profile-header" >
        <
        h2 > My Profile < /h2> {
            !isEditing && ( <
                button onClick = {
                    () => setIsEditing(true) }
                className = "edit-button" >
                Edit Profile <
                /button>
            )
        } <
        /div>

        <
        div className = "profile-avatar-section" >
        <
        img src = { avatarPreview || user.avatar }
        alt = { user.name }
        className = "profile-avatar" /
        >
        <
        div className = "avatar-upload" >
        <
        input type = "file"
        id = "avatar"
        accept = "image/*"
        onChange = { handleAvatarChange }
        style = {
            { display: 'none' } }
        /> <
        label htmlFor = "avatar"
        className = "avatar-label" >
        Choose Image <
        /label> {
            avatarFile && ( <
                button onClick = { handleAvatarUpload }
                className = "upload-button"
                disabled = { loading } >
                { loading ? 'Uploading...' : 'Upload' } <
                /button>
            )
        } <
        /div> <
        /div>

        {
            isEditing ? ( <
                form onSubmit = { handleSubmit }
                className = "profile-form" >
                <
                div className = "form-group" >
                <
                label htmlFor = "name" > Name < /label> <
                input type = "text"
                id = "name"
                name = "name"
                value = { formData.name }
                onChange = { handleChange }
                required /
                >
                <
                /div>

                <
                div className = "form-group" >
                <
                label htmlFor = "email" > Email < /label> <
                input type = "email"
                id = "email"
                name = "email"
                value = { formData.email }
                onChange = { handleChange }
                required /
                >
                <
                /div>

                <
                div className = "form-group" >
                <
                label htmlFor = "password" > New Password(leave blank to keep current) < /label> <
                input type = "password"
                id = "password"
                name = "password"
                value = { formData.password }
                onChange = { handleChange }
                minLength = "6"
                placeholder = "Enter new password" /
                >
                <
                /div>

                <
                div className = "form-group" >
                <
                label htmlFor = "confirmPassword" > Confirm New Password < /label> <
                input type = "password"
                id = "confirmPassword"
                name = "confirmPassword"
                value = { formData.confirmPassword }
                onChange = { handleChange }
                minLength = "6"
                placeholder = "Confirm new password" /
                >
                <
                /div>

                <
                div className = "form-actions" >
                <
                button type = "submit"
                className = "save-button"
                disabled = { loading } > { loading ? 'Saving...' : 'Save Changes' } <
                /button> <
                button type = "button"
                onClick = {
                    () => {
                        setIsEditing(false);
                        setFormData({
                            name: user.name,
                            email: user.email,
                            password: '',
                            confirmPassword: '',
                        });
                    }
                }
                className = "cancel-button"
                disabled = { loading } >
                Cancel <
                /button> <
                /div> <
                /form>
            ) : ( <
                div className = "profile-info" >
                <
                div className = "info-item" >
                <
                span className = "info-label" > Name: < /span> <
                span className = "info-value" > { user.name } < /span> <
                /div> <
                div className = "info-item" >
                <
                span className = "info-label" > Email: < /span> <
                span className = "info-value" > { user.email } < /span> <
                /div> <
                div className = "info-item" >
                <
                span className = "info-label" > Role: < /span> <
                span className = { `info-value role-badge ${user.role}` } > { user.role } <
                /span> <
                /div> <
                div className = "info-item" >
                <
                span className = "info-label" > Member Since: < /span> <
                span className = "info-value" > { new Date(user.createdAt).toLocaleDateString() } <
                /span> <
                /div> <
                /div>
            )
        } <
        /div> <
        /div>
    );
};

export default Profile;