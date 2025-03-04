import { Redis } from '@upstash/redis'
import "dotenv/config";

// const url: string = process.env.UPSTASH_REDIS_REST_URL ?? "";
// const token: string = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

// console.log("url", process.env.UPSTASH_REDIS_REST_TOKEN)

export const redis = new Redis({ url: "https://liberal-buffalo-42570.upstash.io", token: "AaZKAAIjcDE3NjBiM2E4NmMwYzc0MGJlYWRlZmM0NmIyNGJiMjc4MnAxMA" })