const Document = require('../models/Document');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIAssistant {
    constructor() {
        this.name = 'Workforce AI Assistant';
        // Initialize Gemini with the API key from env (if available)
        this.apiKey = process.env.GEMINI_API_KEY;
        if (this.apiKey) {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
        }
    }

    async analyzeResume(resumeText, role = "General") {
        if (!this.genAI) {
            console.warn("GEMINI_API_KEY not configured. Falling back to mock.");
            return this._mockAnalyzeResume(role);
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
You are an expert HR Recruitment AI Assistant. Your task is to analyze the following resume and assess the candidate's fit for the role of **${role}**.

Provide your analysis strictly as a valid JSON object matching this schema exactly:
{
  "overallScore": <number between 0 and 100 representing the fit score>,
  "adaScore": <number between 0 and 100 representing the ADA / ATS compatibility score>,
  "strengths": [<array of 3-4 strings detailing strong points>],
  "weaknesses": [<array of 2-3 strings detailing missing skills or weak points>],
  "languages": [<array of programming or spoken languages the candidate has command over>],
  "relevantTechnologies": [<array of tools, frameworks, and technologies related to the role>],
  "detailedOverview": "<a short paragraph summarizing your assessment>"
}

Do not include markdown formatting like \`\`\`json around the response. Only return the raw JSON string.

--- RESUME TEXT ---
${resumeText || "No text provided. Evaluate this empty resume."}
`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            // Clean markdown block if Gemini happens to include it
            let cleanJson = responseText.trim();
            if (cleanJson.startsWith('```json')) {
                cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
            }

            const analysis = JSON.parse(cleanJson);
            return analysis;
        } catch (error) {
            console.error("Gemini AI Resume Analysis Error:", error);
            // Fallback gracefully
            return this._mockAnalyzeResume(role);
        }
    }

    // High-fidelity Mock implementation simulating AI parsing (fallback)
    async _mockAnalyzeResume(role) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const score = Math.floor(Math.random() * (98 - 70 + 1) + 70);
        const adaScore = Math.floor(Math.random() * (98 - 60 + 1) + 60);
        
        return {
            overallScore: score,
            adaScore: adaScore,
            strengths: [
                "Strong educational background",
                `Demonstrated experience relevant to ${role}`,
                "Good communication and presentation skills evident from resume structure",
                "Familiarity with industry-standard tools"
            ],
            weaknesses: [
                "Lacks specific certifications requested in the job description",
                "Some gaps in employment history",
                "Could improve technical depth in certain core competencies"
            ],
            languages: ["JavaScript", "Python", "English"],
            relevantTechnologies: ["React", "Node.js", "Docker", "MongoDB"],
            detailedOverview: `Based on the provided resume and the requirements for the **${role}** position, the candidate shows strong potential. Their background aligns well with the core responsibilities. Overall, they are a solid fit and highly recommended for the interview stage.`
        };
    }

    async answerContextualQuery(query, employeeContext) {
        if (!this.genAI) {
            return {
                query,
                answer: `This is a placeholder response for: "${query}". GEMINI_API_KEY is not configured.`,
                context: employeeContext || null
            };
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
You are the "Workforce AI Assistant", an internal AI helper for an enterprise.
Answer the following query from an employee.

Employee Context:
${JSON.stringify(employeeContext, null, 2)}

Query: "${query}"

Provide a helpful, polite, and concise answer based on their context.
`;
            const result = await model.generateContent(prompt);
            return {
                query,
                answer: result.response.text(),
                context: employeeContext || null
            };
        } catch (error) {
            console.error("Gemini AI Contextual Query Error:", error);
            return {
                query,
                answer: `Sorry, I encountered an error while processing your request.`,
                context: employeeContext || null
            };
        }
    }

    async searchDocuments(query) {
        // Metadata-based search
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