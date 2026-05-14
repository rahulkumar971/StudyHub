const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String }, // Optional if not logged in
    email: { type: String }, // Optional if not logged in
    message: { type: String, required: true },
    type: { type: String, enum: ['Broken Link', 'Missing Material', 'Feedback', 'Other'], default: 'Feedback' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
