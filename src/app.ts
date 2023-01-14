import express from "express";

const app = express();

app.disable("x-powered-by");

app.get("/liveness", (_, res) => res.send("Live"));
app.get("/readiness", (_, res) => res.send("Ready"));

export default app;
