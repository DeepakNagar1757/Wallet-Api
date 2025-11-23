import ratelimit from "../config/upstash.js";

export default async function rateLimiter(req, res, next) {
  try {
    // Prefer a per-user header if sent, otherwise fallback to client IP
    const userKey = req.headers["x-user-id"];
    const key = userKey || req.ip || req.headers["x-forwarded-for"] || "anon";

    const { success } = await ratelimit.limit(key);
    if (!success) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (err) {
    console.error("rate limiter error", err);
    // allow request if rate limiter fails unexpectedly
    next();
  }
}