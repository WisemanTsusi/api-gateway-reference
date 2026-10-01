import { jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const secret = new TextEncoder().encode(config.JWT_SECRET);

export interface AuthRequest extends Request {
  auth?: { subject: string; role?: string; email?: string };
}

export async function authenticateGateway(
  req: AuthRequest, _res: Response, next: NextFunction
): Promise<void> {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    const error = Object.assign(new Error("Authentication required"), { statusCode: 401, code: "UNAUTHORIZED" });
    next(error);
    return;
  }

  try {
    const { payload } = await jwtVerify(header.slice(7), secret);
    if (!payload.sub) throw new Error("Missing subject");
    req.auth = {
      subject: payload.sub,
      role: typeof payload.role === "string" ? payload.role : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined
    };
    next();
  } catch {
    const error = Object.assign(new Error("Authentication required"), { statusCode: 401, code: "UNAUTHORIZED" });
    next(error);
  }
}
