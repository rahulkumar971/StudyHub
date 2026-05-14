import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ResourceCard from '../components/ResourceCard';
import { SkeletonGrid } from '../components/SkeletonLoader';

/*
  Home Page component for searching and filtering resources.
  Includes pagination, skeleton loading, and toast notifications.
*/
const Home = () => {
    // State for storing the list of resources from the backend
    const [resources, setResources] = useState([]);
    // State to track if data is currently being fetched
    const [loading, setLoading] = useState(true);
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // State for all our filter values
    const [filters, setFilters] = useState({
        course: 'BCA', // Default course is BCA
        type: '',
        year: '',
        search: ''
    });

    // Function to fetch resources from our Express API
    const fetchResources = async (pageNum = 1) => {
        setLoading(true);
        try {
            // Build the query string based on active filters
            const params = new URLSearchParams();
            if (filters.course) params.append('course', filters.course);
            if (filters.type) params.append('type', filters.type);
            if (filters.year) params.append('year', filters.year);
            if (filters.search) params.append('search', filters.search);
            params.append('page', pageNum);
            params.append('limit', 6);

            // Fetch data from the backend
            const response = await axios.get(`http://localhost:5000/api/resources?${params.toString()}`);
            console.log('Home: API Response:', response.data);
            
            // Handle paginated response safely
            const data = response.data;
            if (data && data.resources) {
                setResources(data.resources);
                setTotalPages(data.totalPages || 1);
                setPage(data.currentPage || 1);
            } else if (Array.isArray(data)) {
                // Fallback for non-paginated response
                setResources(data);
                setTotalPages(1);
                setPage(1);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            toast.error('Could not load resources. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // Use effect to re-fetch data whenever a filter changes
    useEffect(() => {
        setPage(1); // Reset to page 1 on filter change
        fetchResources(1);
    }, [filters.course, filters.type, filters.year]);

    // Handle the search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchResources(1);
    };

    // Handle page changes
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchResources(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="pb-20">
            {/* Professional Header Section */}
            <header className="max-w-4xl mx-auto mb-16 pt-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
                    Digital Academic Library
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Access high-quality study materials, past question papers, and comprehensive textbooks curated for your success.
                </p>
            </header>

            {/* Structured Search & Filter Bar */}
            <section className="sticky top-4 z-40 bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-lg mb-12 max-w-6xl mx-auto">
                <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 items-center">
                    
                    {/* Integrated Search Input */}
                    <div className="relative flex-grow w-full lg:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400" 
                            placeholder="Search by title, subject, or keywords..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                        {/* Course Dropdown */}
                        <select 
                            className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer font-medium text-gray-700 min-w-[120px]"
                            value={filters.course}
                            onChange={(e) => setFilters({...filters, course: e.target.value})}
                        >
                            <option value="BCA">BCA</option>
                            <option value="BBA">BBA</option>
                            <option value="BCOM">BCOM</option>
                            <option value="BSC">BSC</option>
                        </select>

                        {/* Type Dropdown */}
                        <select 
                            className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer font-medium text-gray-700 min-w-[140px]"
                            value={filters.type}
                            onChange={(e) => setFilters({...filters, type: e.target.value})}
                        >
                            <option value="">All Materials</option>
                            <option value="Question Paper">Question Paper</option>
                            <option value="Textbook">Textbook</option>
                            <option value="Notes">Notes</option>
                        </select>

                        {/* Year Dropdown */}
                        <select 
                            className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer font-medium text-gray-700 min-w-[120px]"
                            value={filters.year}
                            onChange={(e) => setFilters({...filters, year: e.target.value})}
                        >
                            <option value="">All Years</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>

                        {/* Action Button */}
                        <button 
                            type="submit"
                            className="bg-[#1e293b] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95"
                        >
                            Refine
                        </button>
                    </div>
                </form>
            </section>

            {/* Resources List Display (Horizontal) */}
            {loading ? (
                <div className="max-w-5xl mx-auto px-4">
                    <SkeletonGrid count={4} />
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex flex-col gap-6">
                        {resources.length > 0 ? (
                            resources.map(resource => (
                                <ResourceCard 
                                    key={resource._id} 
                                    resource={resource} 
                                    onDelete={(id) => setResources(prev => prev.filter(r => r._id !== id))}
                                />
                            ))
                        ) : (
                            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching resources</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find anything matching your filters. Try adjusting your search or resetting the filters.</p>
                                <button 
                                    className="text-blue-600 font-bold hover:underline"
                                    onClick={() => setFilters({course: 'BCA', type: '', year: '', search: ''})}
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Minimalist Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-3 mt-20">
                            <button 
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white hover:shadow-md transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            <div className="flex space-x-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                                            page === i + 1 
                                                ? 'bg-[#1e293b] text-white shadow-lg' 
                                                : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white hover:shadow-md transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
