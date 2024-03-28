function normalizeUrl(url) {
    return url.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

module.exports = {
    normalizeUrl
};