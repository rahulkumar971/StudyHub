const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    pages: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    year: { type: String, required: true },
    course: { type: String, required: true, enum: ['BCA', 'BBA', 'BCOM', 'BSC'] },
    type: { type: String, required: true, enum: ['Question Paper', 'Textbook', 'Notes'] },
    fileUrl: { type: String, required: true },
    fileId: { type: String, required: true }, // ImageKit file ID for deletion
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
