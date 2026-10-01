import type { NextFunction, Request, Response } from "express";

interface Bucket { tokens: number; updatedAt: number; }

export class TokenBucketLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly capacity: number, private readonly refillPerSecond: number) {}

  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = req.ip ?? "unknown";
      const now = Date.now();
      const bucket = this.buckets.get(key) ?? { tokens: this.capacity, updatedAt: now };
      const elapsed = (now - bucket.updatedAt) / 1000;
      bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsed * this.refillPerSecond);
      bucket.updatedAt = now;

      if (bucket.tokens < 1) {
        res.setHeader("Retry-After", "1");
        res.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many requests" } });
        return;
      }
      bucket.tokens -= 1;
      this.buckets.set(key, bucket);
      next();
    };
  }
}
