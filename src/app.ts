import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { router } from "./routes.js";
import { requestContext } from "./request-context.js";
import { TokenBucketLimiter } from "./rate-limit.js";
import { errorHandler } from "./errors.js";
import { logger } from "./logger.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN === "*" ? true : config.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(requestContext);

const limiter = new TokenBucketLimiter(config.RATE_LIMIT_CAPACITY, config.RATE_LIMIT_REFILL_PER_SECOND);
app.use(limiter.middleware());

app.use((req, res, next) => {
  const started = Date.now();
  res.on("finish", () => logger.info({
    requestId: res.locals.requestId, method: req.method,
    path: req.originalUrl, statusCode: res.statusCode, durationMs: Date.now() - started
  }, "gateway request"));
  next();
});

app.use(router);
app.use((_req, res) => res.status(404).json({
  error: { code: "ROUTE_NOT_FOUND", message: "Gateway route not found" },
  requestId: res.locals.requestId
}));
app.use(errorHandler);
