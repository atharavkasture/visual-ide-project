const express = require('express');
const { generateCode, executeCode } = require('../controllers/codeController');

const router = express.Router();

// POST /api/generate
router.post('/generate', generateCode);

// POST /api/execute
router.post('/execute', executeCode);

module.exports = router;