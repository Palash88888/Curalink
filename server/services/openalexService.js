export const getOpenAlexData = async (query) => {
  try {
    if (!query) return [];

    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=10`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("OpenAlex API failed");
    }

    const data = await response.json();

    // Normalize results safely
    const results = data?.results || [];

    return results.map((item) => ({
      title: item?.display_name || "No title",
      year: item?.publication_year || "Unknown",
      citations: item?.cited_by_count || 0,
      link: item?.id || "",
      source: "OpenAlex",
    }));

  } catch (error) {
    console.log("OpenAlex Error:", error.message);

    // IMPORTANT: never crash backend
    return [];
  }
};