import { Redis } from "@upstash/redis";
import "dotenv/config";

// Export a redis client constructed from environment variables
export const redis = Redis.fromEnv();
export default redis;
