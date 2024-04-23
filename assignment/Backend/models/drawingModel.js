const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
    imageData: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Drawing', drawingSchema);
