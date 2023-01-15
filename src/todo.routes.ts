import boom from "@hapi/boom";
import express, { ErrorRequestHandler, RequestHandler, Router } from "express";
import { z } from "zod";

const todoList = z.array(z.string());

const validateBody: RequestHandler = (req, res, next) => {
  const result = todoList.safeParse(req.body);
  if (result.success) return next();

  if (result.error instanceof z.ZodError) {
    const error400 = boom.badRequest(
      "Invalid Input. This endpoint expects an array of strings",
      { input: req.body }
    );

    next(error400);
  }
};

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof boom.Boom) {
    const payload = err.output.payload;
    return res
      .status(payload.statusCode)
      .send({ message: payload.message, input: err.data.input });
  }

  return res
    .status(500)
    .send({ message: err?.message || err || "Unknown Error" });
};

const router = Router()
  .use(express.json())
  .put("/users/:userId/todos", validateBody, (req, res) => {
    const todos = req.body;
    res.status(201).send(todos);
  })
  .use(handleError);

export default router;
