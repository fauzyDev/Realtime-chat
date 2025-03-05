import { Redis } from '@upstash/redis'
// import "dotenv/config";

export const redis = new Redis({
    url: "https://liberal-buffalo-42570.upstash.io",
    token: "AaZKAAIjcDE3NjBiM2E4NmMwYzc0MGJlYWRlZmM0NmIyNGJiMjc4MnAxMA"
})