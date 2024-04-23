const express = require('express');
const router = express.Router();
const { saveDrawing, getDrawings } = require('../controllers/drawingController');

router.post('/', saveDrawing);
router.get('/', getDrawings);

module.exports = router;
