import { Redis } from '@upstash/redis'
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
export default redis;
//key-value store operations
// await redis.set("foo", "bar");
// await redis.get("foo");