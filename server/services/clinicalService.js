const axios = require("axios");

async function fetchClinicalTrials(disease) {
  try {
    const res = await axios.get(
      "https://clinicaltrials.gov/api/v2/studies",
      {
        params: {
          "query.cond": disease,
          pageSize: 20,
          format: "json",
        },
      }
    );

    return res.data.studies;
  } catch (err) {
    console.error("ClinicalTrials Error:", err.message);
    return [];
  }
}

module.exports = { fetchClinicalTrials };