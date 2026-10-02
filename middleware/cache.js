const cache = {};
const CACHE_MISS_DELAY_MS = 1000;
const CACHE_TTL_MS = 60 * 1000;

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const cached = cache[key];
  if (cached && cached.expiresAt > Date.now()) {
    res.set('X-Cache', 'HIT');
    return res.json(cached.data);
  }

  delete cache[key];
  res.set('X-Cache', 'MISS');

  setTimeout(next, CACHE_MISS_DELAY_MS);
}

function setCache(key, data) {
  cache[key] = { data, expiresAt: Date.now() + CACHE_TTL_MS };
}

function clearCache() {
  for (const key of Object.keys(cache)) delete cache[key];
}

module.exports = { cacheMiddleware, setCache, clearCache };
