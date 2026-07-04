const Document = require('../models/Document');

class AIAssistant {
    constructor() {
        this.name = 'Workforce AI Assistant';
    }

    async analyzeResume(resumeText) {
        throw new Error('Not implemented yet');
    }

    async answerContextualQuery(query, employeeContext) {
        // Basic stub — responds using whatever employee context is passed in.
        // Full LLM-based reasoning to be wired in later.
        return {
            query,
            answer: `This is a placeholder response for: "${query}". Contextual AI reasoning not fully implemented yet.`,
            context: employeeContext || null
        };
    }

    async searchDocuments(query) {
        // Metadata-based search (no OCR/text-extraction yet — Document model only stores name/type/url)
        const results = await Document.find({
            $or: [
                { documentName: { $regex: query, $options: 'i' } },
                { docType: { $regex: query, $options: 'i' } }
            ]
        }).populate('owner', 'name');

        return results;
    }
}

module.exports = new AIAssistant();