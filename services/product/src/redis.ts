/** @format */

import Redis from "ioredis";
const redis = new Redis({
  port: 6379,
  host: "host.docker.internal",
  password: "Pass1234",
});

export default redis;
