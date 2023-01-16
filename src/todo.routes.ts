import express, { RequestHandler, Router } from "express";
import { TodoService } from "./todo.service";

export default (todoService: TodoService) => {
  const router = Router();
  router.use(express.json());

  router.get("/users/:userId/todos", async (req, res, next) => {
    try {
      const userId = +req.params.userId;
      const response = await todoService.findByUserId(userId);
      res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  });

  const validateTodoList: RequestHandler = ({ body }, _res, next) => {
    const [_todoList, error] = todoService.isValid(body);
    error ? next(error) : next();
  };

  router.put(
    "/users/:userId/todos",
    validateTodoList,
    async ({ params, body: todoList }, res, next) => {
      try {
        const userId = +params.userId;
        const response = await todoService.upsertByUserId(userId, todoList);
        res.status(201).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};
