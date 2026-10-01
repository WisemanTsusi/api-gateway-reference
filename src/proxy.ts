import { createProxyMiddleware } from "http-proxy-middleware";
import type { RequestHandler } from "express";
import { config } from "./config.js";
import { logger } from "./logger.js";

const targets = {
  task: config.TASK_SERVICE_URL,
  user: config.USER_SERVICE_URL,
  ai: config.AI_SERVICE_URL
} as const;

export function proxyRoute(service: keyof typeof targets): RequestHandler {
  return createProxyMiddleware({
    target: targets[service],
    changeOrigin: true,
    proxyTimeout: config.UPSTREAM_TIMEOUT_MS,
    timeout: config.UPSTREAM_TIMEOUT_MS,
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("x-request-id", res.locals.requestId);
        if (req.headers.authorization) {
          proxyReq.setHeader("authorization", req.headers.authorization);
        }
        logger.debug({ service, requestId: res.locals.requestId }, "forwarding request");
      },
      error: (error, _req, res) => {
        logger.error({ error, service, requestId: res.locals?.requestId }, "upstream proxy error");
        if (!res.headersSent) {
          res.status(502).json({
            error: { code: "BAD_GATEWAY", message: `Upstream ${service} service unavailable` },
            requestId: res.locals?.requestId
          });
        }
      }
    }
  });
}
