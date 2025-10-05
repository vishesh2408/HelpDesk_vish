const buckets = new Map();
const MAX = 60;
const WINDOW = 60 * 1000; // ms

export default function rateLimiter(req, res, next) {
  const id = req.header('Authorization') || req.ip;
  const now = Date.now();
  let b = buckets.get(id);
  if (!b) {
    buckets.set(id, { ts: now, count: 1 });
    return next();
  }
  if (now - b.ts > WINDOW) {
    b.ts = now;
    b.count = 1;
    return next();
  }
  b.count++;
  if (b.count > MAX) {
    return res.status(429).json({ error: { code: "RATE_LIMIT" } });
  }
  return next();
}
