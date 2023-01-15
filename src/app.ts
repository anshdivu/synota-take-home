import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("common"));
app.disable("x-powered-by");

app.get("/liveness", (_, res) => res.send("Live"));
app.get("/readiness", (_, res) => res.send("Ready"));

export default app;
