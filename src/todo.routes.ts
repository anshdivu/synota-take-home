import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";
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

export default (db: PrismaClient) => {
  const router = Router().use(express.json());

  router.put("/users/:userId/todos", validateBody, async (req, res, next) => {
    try {
      const userId = +req.params.userId;
      const todoList = req.body;

      const val = await db.todo.upsert({
        where: { authorId: userId },
        update: { list: todoList },
        create: { authorId: userId, list: todoList },
      });

      res.status(201).send(val);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
