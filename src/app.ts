import { PrismaClient } from "@prisma/client";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import apiSpec from "./api.spec.json";
import { basicAuthHandler } from "./auth.handler";
import { errorHandler } from "./error.handler";
import todoRoutes from "./todo.routes";
import { TodoService } from "./todo.service";

const app = express();
const db = new PrismaClient({ log: ["query", "info", "warn", "error"] });

app.disable("x-powered-by");
app.use(morgan("short"));
app.use(express.json());

app.get("/alive", (_, res) => res.send("Live"));
app.get("/ready", async (_, res) => {
  // This server is ready to accept requests once it's connected to the DB
  // and if the db connection fails this server will NEVER we able to accept requests
  // NOTE - $connect function is idempotent; we can safely call it in every `/readiness` call
  await db.$connect();
  res.send("Ready");
});

app.get("/", (_req, res) => res.redirect(301, "/docs"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
app.use(basicAuthHandler(db));
app.use(todoRoutes(new TodoService(db)));

app.use(errorHandler);

export default app;
