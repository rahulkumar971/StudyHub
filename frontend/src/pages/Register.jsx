import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'Client',
        adminCode: '' // Only needed for Admin registration
    });
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registerToast = toast.loading('Creating your account...');
        setLoading(true);
        
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            
            // Update the App's user state
            setUser(res.data.user);
            
            toast.success(`Welcome to StudyHub, ${res.data.user.name}!`, { id: registerToast });
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Try again.', { id: registerToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join StudyHub</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

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

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Account Type</label>
                    <select 
                        className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="Client">Student</option>
                        <option value="Admin">Administrator</option>
                    </select>
                </div>

                {/* Secret code field - only shows up if Admin is selected */}
                {formData.role === 'Admin' && (
                    <div className="flex flex-col space-y-1 bg-blue-50 p-3 rounded border border-blue-200">
                        <label className="text-sm font-bold text-blue-700">Admin Secret Code</label>
                        <input 
                            type="password" 
                            className="border border-blue-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                            placeholder="Enter security code"
                            required
                            value={formData.adminCode}
                            onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                        />
                        <p className="text-[10px] text-blue-600 mt-1">
                            * Only authorized staff can create Admin accounts.
                        </p>
                    </div>
                )}

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors mt-6"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-600 text-sm">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
