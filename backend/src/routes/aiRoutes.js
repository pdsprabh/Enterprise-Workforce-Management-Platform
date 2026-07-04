const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { askAssistant, searchDocumentsAI } = require('../controllers/aiController');

router.post('/ask', protect, askAssistant);
router.get('/search-documents', protect, searchDocumentsAI);

module.exports = router;