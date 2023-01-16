import boom from "@hapi/boom";
import express, { RequestHandler, Router } from "express";
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

const router = Router().use(express.json());

router.put("/users/:userId/todos", validateBody, (req, res) => {
  const todos = req.body;
  res.status(201).send(todos);
});

export default router;
