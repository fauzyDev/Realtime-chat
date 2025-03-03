import { Redis } from '@upstash/redis'

const url: string = process.env.UPSTASH_REDIS_REST_URL ?? "";
const token: string = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

export const redis = new Redis({
  url: url,
  token: token
})