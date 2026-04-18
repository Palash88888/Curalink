const { processQuery } = require("../utils/queryProcessor");
const { fetchPubMed } = require("../services/pubmedService");
const { fetchOpenAlex } = require("../services/openalexService");
const { fetchClinicalTrials } = require("../services/clinicalService");
const { rankResults } = require("../services/ranker");
const { generateAnswer } = require("../services/llmService");
const Chat = require("../models/Chat");

exports.chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ 1. Process Query
    const { disease, expandedQuery } = processQuery(message);

    // ✅ 2. Fetch Data (Parallel)
    const [pubmed, openalex, trials] = await Promise.all([
      fetchPubMed(expandedQuery),
      fetchOpenAlex(expandedQuery),
      fetchClinicalTrials(disease),
    ]);

    // ✅ 3. Rank Results
    const ranked = rankResults(pubmed, openalex, trials);

    // ✅ 4. Get Previous Chat Context (NEW 🔥)
    const history = await Chat.find()
      .sort({ timestamp: -1 })
      .limit(3);

    const contextMessages = history
      .map((h) => `User: ${h.userMessage}\nAI: ${h.aiResponse}`)
      .join("\n");

    // ✅ 5. Send Context + Data to LLM (UPDATED 🔥)
    const answer = await generateAnswer({
      query: message,
      context: contextMessages,
      data: ranked,
    });

    // ✅ 6. Save Chat to MongoDB (NEW 🔥)
    await Chat.create({
      userMessage: message,
      aiResponse: answer,
    });

    // ✅ 7. Send Response
    res.json({
      answer,
      data: ranked,
    });

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};