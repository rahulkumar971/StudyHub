import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, FileText, Download, Bookmark, User, Calendar, Trash2 } from 'lucide-react';

/**
 * Horizontal ResourceCard:
 * - Optimized for list-view listing.
 * - Thumbnail on the left, rich content on the right.
 * - Scribd-inspired typography and spacing.
 */
const ResourceCard = ({ resource, onRemove, onDelete }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    // Generate a robust thumbnail URL for ImageKit resources
    const getThumbnailUrl = (url) => {
        if (!url) return null;
        
        // Handle ImageKit URLs specifically
        if (url.includes('ik.imagekit.io')) {
            try {
                // If it already has transformations, don't modify it
                if (url.includes('/tr:')) return url;
                
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/').filter(Boolean);
                
                // ImageKit URL structure: origin/endpoint_id/path/to/file
                if (pathParts.length >= 2) {
                    const endpointId = pathParts[0];
                    const filePath = pathParts.slice(1).join('/');
                    
                    // Path-based transformations are more reliable for file-type conversion (PDF to JPG)
                    // pg-1 explicitly selects the first page of the PDF
                    return `${urlObj.origin}/${endpointId}/tr:f-jpg,w-300,h-400,cm-pad_resize,pg-1/${filePath}`;
                }
            } catch (err) {
                console.error("Error generating thumbnail:", err);
            }
        }
        
        // Fallback: If it's not ImageKit or parsing fails, return original URL
        return url;
    };

    const thumbnailUrl = getThumbnailUrl(resource.fileUrl);

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // Check if saved
                if (user.savedResources) {
                    const saved = user.savedResources.some(id => {
                        const idStr = typeof id === 'string' ? id : (id._id ? id._id.toString() : id.toString());
                        return idStr === resource._id;
                    });
                    setIsSaved(saved);
                }
                // Check if admin
                setIsAdmin(user.role === 'Admin');
            }
        } catch (e) {
            console.error("Error checking user status:", e);
        }
    }, [resource._id]);

    const handleView = () => {
        if (resource.fileUrl) {
            window.open(resource.fileUrl, '_blank');
        } else {
            toast.error('File link not available');
        }
    };

    const handleDownload = () => {
        if (!resource.fileUrl) {
            toast.error('Download link not available');
            return;
        }
        const link = document.createElement('a');
        link.href = resource.fileUrl;
        link.setAttribute('download', resource.title);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Starting download...');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to save resources.');
            return;
        }

        const saveToast = toast.loading(isSaved ? 'Removing...' : 'Saving...');
        setSaving(true);

        try {
            const res = await axios.post(`http://localhost:5000/api/resources/save/${resource._id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setIsSaved(res.data.saved);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user._id) {
                toast.error('Session error. Please log in again.', { id: saveToast });
                return;
            }
            
            if (res.data.saved) {
                user.savedResources = [...(user.savedResources || []), resource._id];
                toast.success('Saved!', { id: saveToast });
            } else {
                user.savedResources = (user.savedResources || []).filter(id => {
                    const idStr = typeof id === 'string' ? id : (id._id ? id._id.toString() : id.toString());
                    return idStr !== resource._id;
                });
                toast.success('Removed.', { id: saveToast });
            }
            localStorage.setItem('user', JSON.stringify(user));
        } catch (err) {
            console.error('Save Error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error updating collection';
            toast.error(errorMsg, { id: saveToast });
        } finally {
            setSaving(false);
            if (onRemove && isSaved) {
                // If we were saved and now we are not, and we are in collection view
                onRemove(resource._id);
            }
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm('Are you sure you want to permanently delete this resource? This action cannot be undone.')) {
            return;
        }

        const token = localStorage.getItem('token');
        const deleteToast = toast.loading('Deleting resource...');
        setDeleting(true);

        try {
            await axios.delete(`http://localhost:5000/api/resources/${resource._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            toast.success('Resource deleted successfully', { id: deleteToast });
            
            // Call onDelete if provided, otherwise fallback to onRemove or reload
            if (onDelete) {
                onDelete(resource._id);
            } else if (onRemove) {
                onRemove(resource._id);
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error('Delete Error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error deleting resource';
            toast.error(errorMsg, { id: deleteToast });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="scribd-card group flex flex-col md:flex-row gap-5 items-start">
            {/* Left: Thumbnail Section */}
            <div className="relative w-full md:w-40 shrink-0 aspect-[3/4] md:aspect-auto md:h-44 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                {thumbnailUrl ? (
                    <img 
                        src={thumbnailUrl} 
                        alt={resource.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x400/f8fafc/64748b?text=PDF'; }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <FileText size={48} strokeWidth={1} />
                    </div>
                )}
                
                {/* Type Tag Overlay */}
                <div className="absolute bottom-2 left-2">
                    <span className="scribd-tag !text-[10px] !px-2 shadow-sm">
                        {resource.type}
                    </span>
                </div>
            </div>

            {/* Right: Content Section */}
            <div className="flex-grow flex flex-col h-full min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="scribd-title line-clamp-2 cursor-pointer hover:text-blue-700 transition-colors pr-8" onClick={handleView}>
                        {resource.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                        {isAdmin && (
                            <button 
                                onClick={handleDelete}
                                disabled={deleting}
                                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-sm transition-all"
                                title="PERMANENTLY DELETE (Admin Only)"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className={`p-2 rounded-full transition-all ${
                                isSaved 
                                    ? (onRemove ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-blue-600 text-white shadow-md') 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                            title={onRemove ? "Remove from collection" : (isSaved ? "Saved" : "Save to collection")}
                        >
                            {onRemove ? (
                                <Trash2 size={20} />
                            ) : (
                                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                            )}
                        </button>
                    </div>
                </div>

                <p className="scribd-description line-clamp-2 mb-2 leading-relaxed">
                    {resource.description || 'Access this high-quality academic resource designed to help students master their subjects and excel in examinations.'}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:flex md:items-center gap-y-2 md:gap-x-5 scribd-metadata mb-4">
                    <div className="flex items-center">
                        <User size={14} className="mr-2 opacity-70" />
                        <span className="truncate">By {resource.uploadedBy?.name || 'Staff'}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-2 opacity-70" />
                        <span>{resource.year || '2024'}</span>
                    </div>
                    <div className="flex items-center">
                        <FileText size={14} className="mr-2 opacity-70" />
                        <span>{resource.pages || 0} Pages</span>
                    </div>
                    <div className="flex items-center">
                        <Eye size={14} className="mr-2 opacity-70" />
                        <span>{resource.views || 0} Reads</span>
                    </div>
                </div>

                {/* Horizontal Action Bar */}
                <div className="mt-auto flex items-center space-x-3">
                    <button 
                        onClick={handleView}
                        className="btn-scribd-primary !px-6 flex items-center"
                    >
                        <Eye size={16} className="mr-2" />
                        Read Now
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="btn-scribd-secondary !px-6 flex items-center"
                    >
                        <Download size={16} className="mr-2" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
