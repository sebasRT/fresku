import OpenAI from "openai";

let openai: OpenAI;

try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
} catch (error) {
    console.error("Failed to initialize OpenAI instance:", error);
    throw new Error("Failed to initialize OpenAI instance: " + error);
}

export { openai };

