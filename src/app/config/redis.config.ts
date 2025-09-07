/* eslint-disable no-console */
import { createClient } from "redis";
import env from "./env.config";

export const redisClient = createClient({
  username: env.REDIS_USER,
  password: env.REDIS_PASS,
  socket: {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected");
  }
};
