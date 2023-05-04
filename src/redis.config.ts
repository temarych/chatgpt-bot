import { RedisOptions } from "ioredis";
import { RedisClientOptions } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const REDIS_HOST = process.env.REDIS_HOST as string;
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;

export const redisConfig: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD
};

export const redisStoreConfig: RedisClientOptions = {
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  },
  password: REDIS_PASSWORD
};