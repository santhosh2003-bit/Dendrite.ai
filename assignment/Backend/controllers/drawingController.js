const Drawing = require('../models/drawingModel');

exports.saveDrawing = async (req, res) => {
    try {
        const { imageData } = req.body;
        const drawing = await Drawing.create({ imageData });
        res.status(201).json(drawing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDrawings = async (req, res) => {
    try {
        const drawings = await Drawing.find();
        res.status(200).json(drawings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
