import { Redis } from "ioredis";

const getRedisUrl = () => {
  const { REDIS_URL } = process.env;
  if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
  }

  return REDIS_URL;
};

export const redis = new Redis(getRedisUrl());
