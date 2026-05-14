const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Resource = require('../models/Resource');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const imagekit = require('../config/imagekit');

// GET /api/resources - Fetch with filters and pagination
router.get('/', async (req, res) => {
    try {
        const { course, type, year, search, page = 1, limit = 6 } = req.query;
        let query = {};

        if (course) query.course = course;
        if (type) query.type = type;
        if (year) query.year = year;
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const total = await Resource.countDocuments(query);
        const resources = await Resource.find(query)
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            resources,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalResources: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/resources - Add new resource (Admin only)
router.post('/', auth, admin, upload.single('file'), async (req, res) => {
    try {
        let fileUrl = req.body.fileUrl;
        let fileId = req.body.fileId;

        // If a file is actually uploaded
        if (req.file) {
            console.log('Uploading to ImageKit:', req.file.originalname);
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: '/studyhub'
            });
            console.log('ImageKit upload successful');
            fileUrl = uploadResponse.url;
            fileId = uploadResponse.fileId;
        }

        const resource = new Resource({
            title: req.body.title,
            description: req.body.description,
            pages: req.body.pages || 0,
            year: req.body.year,
            course: req.body.course,
            type: req.body.type,
            fileUrl,
            fileId,
            uploadedBy: req.user._id
        });
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/resources/:id - Delete resource (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid resource ID format' });
        }

        const resource = await Resource.findById(id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        // If the resource has an ImageKit fileId, delete it from ImageKit
        if (resource.fileId) {
            try {
                await imagekit.deleteFile(resource.fileId);
                console.log('Deleted file from ImageKit:', resource.fileId);
            } catch (ikError) {
                console.error('Error deleting file from ImageKit:', ikError);
                // We continue even if ImageKit deletion fails, or we could handle it differently
            }
        }

        await Resource.findByIdAndDelete(id);
        
        // Also remove this resource from all users' savedResources array
        await User.updateMany(
            { savedResources: id },
            { $pull: { savedResources: id } }
        );

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Backend Delete Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/resources/my-collection - Get saved resources for the logged-in user
router.get('/my-collection', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedResources',
            populate: { path: 'uploadedBy', select: 'name' }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.savedResources || []);
    } catch (error) {
        console.error('My-Collection Route Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/resources/save/:id - Toggle save resource
router.post('/save/:id', auth, async (req, res) => {
    try {
        console.log('Save attempt by user:', req.user._id, 'for resource:', req.params.id);
        const user = await User.findById(req.user._id);
        const resourceId = req.params.id;

        if (!user.savedResources) {
            user.savedResources = [];
        }

        const isSaved = user.savedResources.some(id => id && id.toString() === resourceId);
        console.log('Current save status (checked with .some):', isSaved);

        if (isSaved) {
            user.savedResources = user.savedResources.filter(id => id && id.toString() !== resourceId);
        } else {
            user.savedResources.push(resourceId);
        }

        await user.save();
        res.json({ message: isSaved ? 'Removed from collection' : 'Saved to collection', saved: !isSaved });
    } catch (error) {
        console.error('Save Route Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
