const aiAssistant = require('../ai/aiAssistant');
const Employee = require('../models/Employee');

exports.askAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        const employee = await Employee.findOne({ user: req.user._id });

        const result = await aiAssistant.answerContextualQuery(query, employee);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.searchDocumentsAI = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'query parameter is required' });
        }
        const results = await aiAssistant.searchDocuments(query);
        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};