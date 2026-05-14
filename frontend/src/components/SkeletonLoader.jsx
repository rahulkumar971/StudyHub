import React from 'react';
import { motion } from 'framer-motion';

/**
 * Horizontal SkeletonCard: 
 * Matches the new horizontal layout of ResourceCard.
 */
const SkeletonCard = () => {
    return (
        <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 shadow-sm mb-6"
        >
            {/* Left: Thumbnail Skeleton */}
            <div className="w-full md:w-40 shrink-0 h-44 bg-gray-100 rounded-lg"></div>

            {/* Right: Content Skeleton */}
            <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                </div>

                <div className="flex gap-4 pt-2">
                    <div className="h-3 w-20 bg-gray-50 rounded"></div>
                    <div className="h-3 w-16 bg-gray-50 rounded"></div>
                    <div className="h-3 w-16 bg-gray-50 rounded"></div>
                </div>

                <div className="flex space-x-3 pt-4">
                    <div className="h-10 w-32 bg-gray-100 rounded-xl"></div>
                    <div className="h-10 w-32 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        </motion.div>
    );
};

export const SkeletonGrid = ({ count = 4 }) => {
    return (
        <div className="max-w-5xl mx-auto px-4">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export default SkeletonCard;
