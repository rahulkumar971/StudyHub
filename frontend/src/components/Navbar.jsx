import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        // Clear both localStorage and the App's user state
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    // Helper to highlight active link
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-50">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-black text-[#111827] no-underline tracking-tighter">
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <BookOpen size={20} />
                    </div>
                    <span>StudyHub</span>
                </Link>

                <div className="flex items-center space-x-8 text-sm font-semibold">
                    <Link 
                        to="/" 
                        className={`${isActive('/') ? 'text-blue-600' : 'text-gray-500'} hover:text-[#111827] transition-colors no-underline`}
                    >
                        Explore
                    </Link>
                    
                    <Link 
                        to="/collection" 
                        className={`${isActive('/collection') ? 'text-blue-600' : 'text-gray-500'} hover:text-[#111827] transition-colors no-underline`}
                    >
                        Saved
                    </Link>
                    
                    {user?.role === 'Admin' && (
                        <Link 
                            to="/admin" 
                            className={`${isActive('/admin') ? 'text-blue-600' : 'text-gray-500'} hover:text-[#111827] transition-colors no-underline`}
                        >
                            Admin Hub
                        </Link>
                    )}
                    
                    <div className="h-6 w-px bg-gray-100"></div>

                    {user ? (
                        <div className="flex items-center space-x-5">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Member</span>
                                <span className="text-[#111827] leading-none">{user.name}</span>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="btn-scribd-secondary px-3 py-1.5"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-500 hover:text-[#111827] no-underline">Log In</Link>
                            <Link to="/register" className="btn-scribd-primary">Sign Up Free</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
