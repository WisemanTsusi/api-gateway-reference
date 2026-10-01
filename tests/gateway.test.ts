import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("API Gateway", () => {
  it("reports health without authentication", async () => {
    const r = await request(app).get("/health");
    expect(r.status).toBe(200);
    expect(r.body.status).toBe("ok");
  });

  it("rejects protected routes without a token", async () => {
    const r = await request(app).get("/api/v1/tasks");
    expect(r.status).toBe(401);
    expect(r.body.error.code).toBe("UNAUTHORIZED");
  });

  it("propagates request IDs", async () => {
    const r = await request(app).get("/health").set("x-request-id", "portfolio-test-123");
    expect(r.headers["x-request-id"]).toBe("portfolio-test-123");
  });

  it("returns a gateway 404 for unknown routes", async () => {
    const r = await request(app).get("/unknown");
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});
