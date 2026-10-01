import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_SECRET: z.string().min(32),
  TASK_SERVICE_URL: z.string().url().default("http://localhost:4100"),
  USER_SERVICE_URL: z.string().url().default("http://localhost:4200"),
  AI_SERVICE_URL: z.string().url().default("http://localhost:4300"),
  RATE_LIMIT_CAPACITY: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_REFILL_PER_SECOND: z.coerce.number().positive().default(2),
  UPSTREAM_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default("*")
});

export const config = schema.parse(process.env);
