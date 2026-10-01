import type { NextFunction, Request, Response } from "express";
import { logger } from "./logger.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const status = typeof error === "object" && error !== null && "statusCode" in error
    ? Number((error as { statusCode?: unknown }).statusCode) : 500;
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code) : "INTERNAL_ERROR";

  if (status >= 500) logger.error({ error, requestId: res.locals.requestId }, "gateway error");

  res.status(status >= 400 && status < 600 ? status : 500).json({
    error: {
      code,
      message: status === 500 ? "Gateway error" : error instanceof Error ? error.message : String(error)
    },
    requestId: res.locals.requestId
  });
}
