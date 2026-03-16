import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

// Groq client (OpenAI-compatible)
const groqClient = groqApiKey ? new OpenAI({
    apiKey: groqApiKey,
    baseURL: 'https://api.groq.com/openai/v1',
}) : null;

// OpenRouter client for Ollama-compatible open models
const openRouterClient = openRouterApiKey ? new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'ThinkDSA',
    },
}) : null;

export const generateAIResponse = async (
    systemPrompt: string,
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    model: 'groq' | 'ollama' = 'groq'
) => {
    const isMock = model === 'groq' ? !groqClient : !openRouterClient;

    if (isMock) {
        console.log('Mock AI Response — no API key configured for model:', model);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return `This is a mock response. Please configure the API key for the ${model} model.`;
    }

    try {
        if (model === 'groq') {
            const completion = await groqClient!.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
            });
            return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
        } else {
            // Ollama via OpenRouter — use a free open-source model
            const completion = await openRouterClient!.chat.completions.create({
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
            });
            return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
        }
    } catch (error) {
        console.error(`Error calling ${model}:`, error);
        return "I'm sorry, I encountered an error while processing your request.";
    }
};
