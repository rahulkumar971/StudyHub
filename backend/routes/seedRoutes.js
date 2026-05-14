const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

router.post('/seed', async (req, res) => {
    const mockData = [
        { title: 'BCA 1st Sem Math Question Paper 2024', course: 'BCA', year: '2024', type: 'Question Paper', fileUrl: 'https://placehold.co/600x400?text=BCA+Math+2024', fileId: 'mock1' },
        { title: 'BCA 2nd Sem C++ Notes', course: 'BCA', year: '2025', type: 'Notes', fileUrl: 'https://placehold.co/600x400?text=BCA+CPP+Notes', fileId: 'mock2' },
        { title: 'BBA Marketing Textbook', course: 'BBA', year: '2024', type: 'Textbook', fileUrl: 'https://placehold.co/600x400?text=BBA+Marketing', fileId: 'mock3' },
        { title: 'BCOM Accounting Question Paper 2025', course: 'BCOM', year: '2025', type: 'Question Paper', fileUrl: 'https://placehold.co/600x400?text=BCOM+Accounting', fileId: 'mock4' },
    ];

    try {
        await Resource.deleteMany({ fileId: { $in: ['mock1', 'mock2', 'mock3', 'mock4'] } });
        await Resource.insertMany(mockData);
        res.json({ message: 'Mock data seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
