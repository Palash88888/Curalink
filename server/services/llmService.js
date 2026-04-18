const axios = require("axios");

async function generateAnswer({ query, context, data }) {
  const prompt = `
You are an AI Medical Research Assistant.

User Query:
${query}

Previous Conversation:
${context}

Research Data:
${JSON.stringify(data)}

Instructions:
- Give structured response
- Include:
  1. Condition Overview
  2. Research Insights
  3. Clinical Trials
  4. Sources
- Do NOT hallucinate
- Use only provided data
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "mistral",
    prompt,
    stream: false,
  });

  return res.data.response;
}

module.exports = { generateAnswer };