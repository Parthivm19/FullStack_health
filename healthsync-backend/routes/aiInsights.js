const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

router.post("/symptom-analysis", auth, async (req, res) => {

    try {

        const { symptom } = req.body;

        if (!symptom) {

            return res.status(400).json({
                error: "Symptom description required"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite"
        });

        const prompt = `
        You are a professional premium medical symptom analysis assistant.
        Analyze these symptoms:

        "${symptom}"

        Rules:
        - Do NOT provide a confirmed diagnosis.
        - Keep response medically cautious.
        - Use SIMPLE plain English.
        - NO markdown symbols.
        - Keep response under 120 words.

        Return response EXACTLY in this format:

        Possible Causes:
        - cause 1
        - cause 2

        Recommendations:
        - recommendation 1
        - recommendation 2

        Only return the response itself.
        `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        console.log(response);

        res.json({
            analysis: response
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "AI analysis failed"
        });
    }
});

module.exports = router;