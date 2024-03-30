function printReport(pages) {
  const sortedPages = sortPages(pages);
  const reportData = [];
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hits = sortedPage[1];
    reportData.push({ url, hits });
  }
  console.log("================");
  console.log("== REPORT GENERATED ====");
  console.log("================");
  return reportData;
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1] - a[1]);
  return pagesArray;
}

module.exports = { printReport };
