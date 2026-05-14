import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ResourceCard from '../components/ResourceCard';
import { SkeletonGrid } from '../components/SkeletonLoader';

/*
  Collection page component.
  Displays the study materials saved by the user.
*/
const Collection = () => {
    const [savedResources, setSavedResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the user's collection on component mount
    useEffect(() => {
        const fetchCollection = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/resources/my-collection', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSavedResources(res.data);
            } catch (err) {
                console.error('Failed to load collection:', err);
                toast.error('Could not load your collection. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCollection();
    }, []);

    // Handle removing a resource from the UI collection
    const handleRemove = (resourceId) => {
        setSavedResources(prev => prev.filter(res => res._id !== resourceId));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-10 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Collection</h1>
                <p className="text-gray-500">Quickly access the documents you've bookmarked for your studies.</p>
            </header>

            {loading ? (
                <div className="max-w-5xl mx-auto px-4">
                    <SkeletonGrid count={4} />
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-4 flex flex-col gap-6">
                    {savedResources.length > 0 ? (
                        savedResources.map(resource => (
                            <ResourceCard 
                                key={resource._id} 
                                resource={resource} 
                                onRemove={handleRemove} 
                                onDelete={handleRemove}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <span className="text-5xl mb-4 block">📚</span>
                            <h3 className="text-lg font-bold text-gray-700 mb-1">Your collection is empty</h3>
                            <p className="text-gray-500 mb-6">Start exploring resources and click the bookmark icon to save them here.</p>
                            <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block">
                                Explore Resources
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Collection;
