import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const getModel = (systemInstruction) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(API_KEY);

    const modelConfig = {
        model: "gemini-2.0-flash",
    };

    if (systemInstruction) {
        modelConfig.systemInstruction = systemInstruction;
    }

    return genAI.getGenerativeModel(modelConfig);
};

export async function generateContent(prompt, systemInstruction) {
    try {
        const model = getModel(systemInstruction);
        const chatSession = model.startChat({
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}

export async function* streamContent(prompt, systemInstruction) {
    try {
        const model = getModel(systemInstruction);
        const chatSession = model.startChat({
            history: [],
        });

        const result = await chatSession.sendMessageStream(prompt);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText;
        }
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}
