import express from "express";
import morgan from "morgan";

import todoRoutes from "./todo.routes";

const app = express();

app.disable("x-powered-by");
app.use(morgan("combined"));

app.get("/liveness", (_, res) => res.send("Live"));
app.get("/readiness", (_, res) => res.send("Ready"));

app.use(todoRoutes);

export default app;
