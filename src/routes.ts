import { Router } from "express";
import { authenticateGateway } from "./auth.js";
import { proxyRoute } from "./proxy.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway-reference" });
});

router.get("/ready", (_req, res) => {
  res.json({ status: "ready" });
});

router.use("/api/v1/tasks", authenticateGateway, proxyRoute("task"));
router.use("/api/v1/users", authenticateGateway, proxyRoute("user"));
router.use("/api/v1/ai", authenticateGateway, proxyRoute("ai"));
