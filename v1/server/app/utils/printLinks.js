function printLinkStructure(pages) {
  const sortedPages = sortPages(pages);
  const linkStructure = [];
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hits = sortedPage[1];
    linkStructure.push({ url, hits });
  }
  console.log("================");
  console.log("== REPORT GENERATED ====");
  console.log("================");
  return linkStructure;
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1] - a[1]);
  return pagesArray;
}

module.exports = { printLinkStructure };
