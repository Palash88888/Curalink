export function expandQuery(query) {
  return [
    query,
    `${query} causes`,
    `${query} treatment`,
    `${query} clinical trials`,
    `${query} research paper`
  ];
}