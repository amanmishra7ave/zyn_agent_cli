import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";

export async function generateContent(prompt, systemInstruction) {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt: `${systemInstruction}\n\nUser: ${prompt}`,
            stream: false,
        });
        return response.data.response;
    } catch (error) {
        console.error("Ollama API Error:", error.message);
        throw error;
    }
}

export async function* streamContent(prompt, systemInstruction) {
    try {
        const response = await axios.post(
            `${OLLAMA_HOST}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt: `${systemInstruction}\n\nUser: ${prompt}`,
                stream: true,
            },
            { responseType: "stream" }
        );

        for await (const chunk of response.data) {
            const lines = chunk.toString().split("\n");
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        yield json.response;
                    }
                } catch (e) {
                }
            }
        }
    } catch (error) {
        console.error("Ollama API Error:", error.message);
        throw error;
    }
}
