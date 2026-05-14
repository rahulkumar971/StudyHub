import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginToast = toast.loading('Signing in...');
        setLoading(true);
        
        try {
            console.log('Attempting login with:', formData.email);
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            // Save to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            
            // Update the App's reactive state
            setUser(res.data.user);
            
            toast.success(`Welcome back, ${res.data.user.name}!`, { id: loginToast });
            console.log('Login successful, navigating home');
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.response?.data?.message || 'Login failed. Check your email and password.', { id: loginToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to StudyHub</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                        placeholder="example@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors mt-6"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-600 text-sm">
                Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
