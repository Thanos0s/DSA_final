import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

// Mock mode if no key provided
const isMock = !apiKey;

// Groq uses an OpenAI-compatible API
const client = apiKey ? new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
}) : null;

export const generateAIResponse = async (
    systemPrompt: string,
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
) => {
    if (isMock || !client) {
        console.log('Mock AI Response');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return "This is a mock response from the AI tutor. Please configure GROQ_API_KEY to get real responses.";
    }

    try {
        const completion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        });

        return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error('Error calling Groq:', error);
        return "I'm sorry, I encountered an error while processing your request.";
    }
};
