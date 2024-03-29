function storeReport(pages) {
  const sortedPages = sortPages(pages);
  const reportArray = [];

  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hits = sortedPage[1];

    reportArray.push({ url, hits });
  }

  return reportArray;
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1] - a[1]);
  return pagesArray;
}

module.exports = { storeReport };
