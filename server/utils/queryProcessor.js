function processQuery(input) {
  const diseaseKeywords = ["cancer", "diabetes", "parkinson", "alzheimer"];

  let disease = "";
  let intent = input.toLowerCase();

  diseaseKeywords.forEach((d) => {
    if (intent.includes(d)) disease = d;
  });

  // Query Expansion
  let expandedQuery = disease
    ? `${intent} AND ${disease}`
    : intent;

  return { disease, expandedQuery };
}

module.exports = { processQuery };