import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

/*
  Admin Dashboard component for uploading new study materials.
  Only accessible by users with the 'Admin' role.
*/
const AdminDashboard = () => {
    // State for the document upload form
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pages: 0,
        course: 'BCA',
        year: '2024',
        type: 'Question Paper'
    });
    // State to store the selected file
    const [file, setFile] = useState(null);
    // Loading state for the upload button
    const [loading, setLoading] = useState(false);

    // Handle the file upload process
    const handleUpload = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!file) {
            toast.error('Please select a PDF file first.');
            return;
        }

        const uploadToast = toast.loading('Uploading resource...');
        setLoading(true);

        try {
            // Using FormData to send the file to our backend
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('pages', formData.pages);
            data.append('course', formData.course);
            data.append('year', formData.year);
            data.append('type', formData.type);
            data.append('file', file);

            // Get token from storage for authentication
            const token = localStorage.getItem('token');
            
            // POST request to our API
            await axios.post('http://localhost:5000/api/resources', data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear form on success
            toast.success('Resource uploaded successfully!', { id: uploadToast });
            setFormData({ title: '', course: 'BCA', year: '2024', type: 'Question Paper', description: '', pages: 0 });
            setFile(null);
            e.target.reset(); // Reset the HTML file input
            
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong during upload.', { id: uploadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Upload and manage academic resources for students.</p>
            </header>

            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Upload New Document</h2>

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* Title Input */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-gray-700">Document Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. BCA 2nd Semester Data Structures Notes"
                            required
                            className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Description Input */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea 
                            placeholder="Briefly describe the contents of this resource..."
                            className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 h-24 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Page Count */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-bold text-gray-700">Total Pages</label>
                            <input 
                                type="number" 
                                placeholder="0"
                                className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                value={formData.pages}
                                onChange={(e) => setFormData({...formData, pages: e.target.value})}
                            />
                        </div>

                        {/* Course Dropdown */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-bold text-gray-700">Course</label>
                            <select 
                                className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                value={formData.course}
                                onChange={(e) => setFormData({...formData, course: e.target.value})}
                            >
                                <option value="BCA">BCA</option>
                                <option value="BBA">BBA</option>
                                <option value="BCOM">BCOM</option>
                                <option value="BSC">BSC</option>
                            </select>
                        </div>

                        {/* Type Dropdown */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-bold text-gray-700">Material Type</label>
                            <select 
                                className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="Question Paper">Question Paper</option>
                                <option value="Textbook">Textbook</option>
                                <option value="Notes">Notes</option>
                            </select>
                        </div>

                        {/* Year Dropdown */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-bold text-gray-700">Academic Year</label>
                            <select 
                                className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                            >
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>
                    </div>

                    {/* File Input */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-gray-700">File (PDF Only)</label>
                        <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
                        />
                    </div>

                    {/* Upload Button */}
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition-colors w-full md:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Uploading File...' : 'Upload Resource'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
