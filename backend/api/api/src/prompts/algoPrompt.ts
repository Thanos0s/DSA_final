export const ALGO_VISUALIZER_PROMPT = (problemTitle: string, problemStatement: string) => `
You are an expert algorithm designer. Given the following DSA problem, generate a structured algorithm plan as pure JSON.

Problem Title: ${problemTitle}
Problem Statement: ${problemStatement}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "title": "Name of the best algorithm/approach",
  "complexity": {
    "time": "O(?)",
    "space": "O(?)"
  },
  "steps": [
    {
      "id": 1,
      "title": "Short step title (max 5 words)",
      "description": "Clear explanation of what happens in this step (1-2 sentences)",
      "type": "init"
    }
  ]
}

Rules:
- "type" must be one of: "init", "loop", "condition", "process", "return"
- Generate between 4 and 7 steps
- Keep descriptions concise and educational
- Focus on the optimal algorithm approach
- Do NOT include any text outside the JSON object
`;
