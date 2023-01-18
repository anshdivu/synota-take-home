import { Todo, User } from "@prisma/client";
import express, { ErrorRequestHandler, RequestHandler } from "express";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import todoRoutes from "../todo.routes";
import { TodoService } from "../todo.service";

describe.concurrent("todo.routes", () => {
  const addUserToReq: (id: number) => RequestHandler =
    (id) => (req, _res, next) => {
      req.user = { id } as User;
      next();
    };

  describe("GET /todos", () => {
    test("returns the users list of todos", async () => {
      const expectedTodo = { list: ["test_1", "Test_2"] } as Todo;

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "findByUserId").mockReturnValueOnce(
        Promise.resolve(expectedTodo)
      );

      const app = express()
        .use(addUserToReq(10))
        .use(todoRoutes(service))
        .use(failOnUnCatchError);
      const response = await request(app).get("/users/10/todos");

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expectedTodo);
    });

    test("forwards errors to next handler", async () => {
      const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
        res.status(999).send(err.message);
      };

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "findByUserId").mockImplementationOnce(() =>
        Promise.reject(new Error("test error msg from findByUserId"))
      );

      const app = express()
        .use(addUserToReq(11))
        .use(todoRoutes(service))
        .use(handleException);
      const response = await request(app).get("/users/11/todos");

      expect(response.statusCode).toBe(999);
      expect(response.text).toEqual("test error msg from findByUserId");
    });

    test("throws unauthorized error to next handler", async () => {
      const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
        res.status(err.output.payload.statusCode).send(err.message);
      };

      const service = new TodoService(undefined as any);
      const app = express()
        .use(addUserToReq(99))
        .use(todoRoutes(service))
        .use(handleException);
      const response = await request(app).get("/users/11/todos");

      expect(response.statusCode).toBe(401);
      expect(response.text).toEqual(
        "Logged in User (id:99) can't access resources of User (id:11)"
      );
    });
  });

  describe("PUT /todos", () => {
    test("accepts a list of string", async () => {
      const expectedTodo = { list: ["test_1", "Test_2"] } as Todo;

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "upsertByUserId").mockReturnValueOnce(
        Promise.resolve(expectedTodo)
      );

      const app = express()
        .use(addUserToReq(12))
        .use(todoRoutes(service))
        .use(failOnUnCatchError);

      const response = await request(app)
        .put("/users/12/todos")
        .send(expectedTodo.list);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expectedTodo);
    });

    test("forwards errors to next handler", async () => {
      const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
        res.status(999).send(err.message);
      };
      const expectedTodo = { list: ["test_1", "Test_2"] } as Todo;

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "upsertByUserId").mockImplementationOnce(() =>
        Promise.reject(new Error("test error msg from upsertByUserId"))
      );

      const app = express()
        .use(addUserToReq(13))
        .use(todoRoutes(service))
        .use(handleException);

      const response = await request(app)
        .put("/users/13/todos")
        .send(expectedTodo.list);

      expect(response.statusCode).toBe(999);
      expect(response.text).toEqual("test error msg from upsertByUserId");
    });

    test("fails when body not a list of string", async () => {
      const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
        res.status(999).send(err);
      };

      const expectedTodo = { testObj: "invalid" };
      const service = new TodoService(undefined as any);

      const app = express()
        .use(addUserToReq(14))
        .use(todoRoutes(service))
        .use(handleException);

      const response = await request(app)
        .put("/users/14/todos")
        .send(expectedTodo);

      expect(response.statusCode).toBe(999);
      expect(response.body.data.input).toEqual(expectedTodo);
    });

    test("throws unauthorized error to next handler", async () => {
      const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
        res.status(err.output.payload.statusCode).send(err.message);
      };

      const service = new TodoService(undefined as any);

      const app = express()
        .use(addUserToReq(99))
        .use(todoRoutes(service))
        .use(handleException);

      const response = await request(app).put("/users/14/todos");

      expect(response.statusCode).toBe(401);
      expect(response.text).toEqual(
        "Logged in User (id:99) can't access resources of User (id:14)"
      );
    });
  });
});

const failOnUnCatchError: ErrorRequestHandler = (err, _req, _res, _next) => {
  console.error(err);
  expect.fail(err?.message);
};
