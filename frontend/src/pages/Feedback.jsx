import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

/**
 * Redesigned Feedback & Support page:
 * - Scribd-inspired typography and spacing.
 * - Default email pre-filled.
 * - Direct contact link.
 */
const Feedback = () => {
    // Form state object with default email as requested
    const [formData, setFormData] = useState({
        type: 'Feedback',
        message: '',
        email: 'rahulkumarsg9916@gmail.com' 
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const feedbackToast = toast.loading('Processing...');
        setLoading(true);
        try {
            // 1. Still save to Database for records
            await axios.post('http://localhost:5000/api/feedback', formData);
            
            // 2. Simple Method: Open local email client (No passwords needed)
            const subject = encodeURIComponent(`StudyHub Support: ${formData.type}`);
            const body = encodeURIComponent(`Issue Type: ${formData.type}\nFrom: ${formData.email}\n\nMessage:\n${formData.message}`);
            window.location.href = `mailto:rahulkumarsg9916@gmail.com?subject=${subject}&body=${body}`;

            setSuccess(true);
            toast.success('Ready to send!', { id: feedbackToast });
            setFormData({ ...formData, message: '' });
        } catch (err) {
            console.error('Submission failed:', err);
            toast.error('Could not process request. Try again later.', { id: feedbackToast });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center">
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={40} />
                </div>
                <h2 className="scribd-title !text-3xl mb-4">Message Received!</h2>
                <p className="scribd-description mb-10 max-w-md mx-auto">
                    Thank you for helping us improve StudyHub. Our team will review your message and get back to you if necessary.
                </p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="btn-scribd-primary !px-8"
                >
                    Send another response
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <header className="mb-16 text-center max-w-2xl mx-auto">
                <h1 className="scribd-title !text-4xl mb-4">Feedback & Support</h1>
                <p className="scribd-description text-lg">
                    Have a suggestion or found a broken link? Let us know. You can also reach us directly at <a href="mailto:rahulkumarsg9916@gmail.com" className="text-blue-600 font-bold hover:underline">rahulkumarsg9916@gmail.com</a>
                </p>
            </header>

            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Topic</label>
                                <select 
                                    className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Broken Link">Broken Link</option>
                                    <option value="Missing Material">Request Material</option>
                                    <option value="Feedback">General Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Your Email</label>
                                <input 
                                    type="email" 
                                    className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 font-medium text-gray-700"
                                    placeholder="yourname@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                            <textarea 
                                className="bg-gray-50 border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 min-h-[160px] resize-none font-medium text-gray-700"
                                placeholder="Tell us more about your issue or suggestion..."
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#1e293b] text-white py-4 rounded-xl font-black hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>Sending...</span>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Submit Feedback</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
