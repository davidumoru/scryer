function normalizeURL(url) {
    return url.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

module.exports = {
    normalizeURL
};