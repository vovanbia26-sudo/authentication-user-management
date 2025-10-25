import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
    return ( <
        Router >
        <
        AuthProvider >
        <
        div className = "App" >
        <
        Navbar / >
        <
        Routes >
        <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/signup"
        element = { < Signup / > }
        /> <
        Route path = "/forgot-password"
        element = { < ForgotPassword / > }
        /> <
        Route path = "/reset-password/:token"
        element = { < ResetPassword / > }
        />

        { /* Protected Routes */ } <
        Route path = "/profile"
        element = { <
            PrivateRoute >
            <
            Profile / >
            <
            /PrivateRoute>
        }
        />

        { /* Admin Only Routes */ } <
        Route path = "/admin"
        element = { <
            PrivateRoute adminOnly = { true } >
            <
            AdminDashboard / >
            <
            /PrivateRoute>
        }
        /> <
        /Routes>

        <
        ToastContainer position = "top-right"
        autoClose = { 3000 }
        hideProgressBar = { false }
        newestOnTop closeOnClick rtl = { false }
        pauseOnFocusLoss draggable pauseOnHover /
        >
        <
        /div> <
        /AuthProvider> <
        /Router>
    );
}

export default App;