import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./logger.js";

const server = app.listen(config.PORT, () => logger.info({ port: config.PORT }, "API gateway listening"));
const shutdown = (signal: string) => { logger.info({ signal }, "shutdown requested"); server.close(() => process.exit(0)); };
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
