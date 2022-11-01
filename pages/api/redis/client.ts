import IORedis from "ioredis";

const redisClient = new IORedis(
  parseInt(process.env.REDIS_PORT ?? "6379"),
  process.env.REDIS_HOST ?? "localhost",
  {}
);

export default redisClient;
