import express from "express";
import morgan from "morgan";

import { PrismaClient } from "@prisma/client";
import handleErrors from "./error.handler";
import todoRoutes from "./todo.routes";

const app = express();
const db = new PrismaClient({ log: ["query", "info", "warn", "error"] });

app.disable("x-powered-by");
app.use(morgan("short"));
app.use(express.json());

app.get("/liveness", (_, res) => res.send("Live"));
app.get("/readiness", async (_, res) => {
  // This server is ready to accept request once it's connect to the DB
  // and if the db connection fails this server will NEVER we able to accept requests
  // NOTE - $connect function is idempotent; we can call it safely in every `/readiness` call
  await db.$connect();
  res.send("Ready");
});

app.use(todoRoutes);
app.use(handleErrors);

export default app;
