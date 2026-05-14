const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).json({ message: 'Feedback saved to database' });
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
