import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getPubMedData } from "./services/pubmedService.js";
import { getOpenAlexData } from "./services/openalexService.js";
import { rankResults } from "./services/ranker.js";
import { expandQuery } from "./utils/queryExpander.js";

dotenv.config();

// ================= APP INIT (IMPORTANT) =================
const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(express.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.json({ message: "Curalink AI Server Running 🚀" });
});

// ================= OLLAMA FUNCTION =================
const callOllama = async (prompt) => {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response || "No AI response";

  } catch (err) {
    console.log("Ollama error:", err.message);
    return "Ollama not running";
  }
};

// ================= MAIN ROUTE =================
app.post("/api/chat", async (req, res) => {
  const { query } = req.body;

  console.log("User Query:", query);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const expandedQuery = expandQuery(query);

    const [pubmedDataRaw, openalexDataRaw] = await Promise.all([
      getPubMedData(expandedQuery),
      getOpenAlexData(expandedQuery),
    ]);

    // SAFE ARRAY HANDLING
    const pubmedData = Array.isArray(pubmedDataRaw) ? pubmedDataRaw : [];
    const openalexData = Array.isArray(openalexDataRaw) ? openalexDataRaw : [];

    const ranked = rankResults(pubmedData, openalexData, []);

    const prompt = `
You are a medical research assistant.

User Query: ${query}

Research Data:
${JSON.stringify(ranked.publications, null, 2)}

Explain in simple language.
`;

    const aiText = await callOllama(prompt);

    res.json({
      response: aiText,
      publications: ranked.publications,
      trials: ranked.trials,
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      response: "Server crashed",
    });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});