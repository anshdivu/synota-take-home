import express from "express";
import morgan from "morgan";

import handleErrors from "./error.handler";
import todoRoutes from "./todo.routes";

const app = express();

app.disable("x-powered-by");
app.use(morgan("short"));
app.use(express.json());

app.get("/liveness", (_, res) => res.send("Live"));
app.get("/readiness", (_, res) => res.send("Ready"));

app.use(todoRoutes);
app.use(handleErrors);

export default app;
