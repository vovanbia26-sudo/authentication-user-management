import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import './Auth.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, formData.password);
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            const message = error.response ? .data ? .message || 'Password reset failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "auth-container" >
        <
        div className = "auth-box" >
        <
        h2 className = "auth-title" > Reset Password < /h2> <
        p className = "auth-subtitle" > Enter your new password. < /p>

        <
        form onSubmit = { handleSubmit }
        className = "auth-form" >
        <
        div className = "form-group" >
        <
        label htmlFor = "password" > New Password < /label> <
        input type = "password"
        id = "password"
        name = "password"
        value = { formData.password }
        onChange = { handleChange }
        placeholder = "Enter new password"
        required minLength = "6" /
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
        placeholder = "Confirm new password"
        required minLength = "6" /
        >
        <
        /div>

        <
        button type = "submit"
        className = "auth-button"
        disabled = { loading } > { loading ? 'Resetting...' : 'Reset Password' } <
        /button> <
        /form> <
        /div> <
        /div>
    );
};

export default ResetPassword;