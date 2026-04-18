import fetch from "node-fetch";

export const getPubMedData = async (query) => {
  try {
    // Step 1: Search IDs
    const searchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmax=5&retmode=json`
    );

    const searchData = await searchRes.json();
    const ids = searchData.esearchresult.idlist.join(",");

    // Step 2: Fetch details
    const detailRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`
    );

    const detailData = await detailRes.json();

    return detailData.result;
  } catch (error) {
    console.error("PubMed Error:", error);
    return null;
  }
};