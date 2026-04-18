export function rankResults(pubmed, openalex, trials) {

  const score = (item) => {
    let s = 0;

    if (item.abstract && item.abstract !== "No abstract") s += 3;
    if (item.year > 2020) s += 3;
    if (item.source === "PubMed") s += 2;

    return s;
  };

  const publications = [...pubmed, ...openalex];

  publications.sort((a, b) => score(b) - score(a));

  return {
    publications: publications.slice(0, 8),
    trials: trials.slice(0, 5),
  };
}