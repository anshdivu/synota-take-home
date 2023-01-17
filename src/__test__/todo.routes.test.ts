import { Todo } from "@prisma/client";
import express, { ErrorRequestHandler } from "express";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import todoRoutes from "../todo.routes";
import { TodoService } from "../todo.service";

describe("todo.routes", () => {
  describe("GET /todos", () => {
    test("returns the users list of todos", async () => {
      const expectedTodo = { list: ["test_1", "Test_2"] } as Todo;

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "findByUserId").mockReturnValueOnce(
        Promise.resolve(expectedTodo)
      );

      const app = express().use(todoRoutes(service)).use(failOnUnCatchError);
      const response = await request(app).get("/users/test_user/todos");

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expectedTodo);
    });

    test("forwards errors to next handler", async () => {
      const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
        res.status(999).send(err.message);
      };

      const expectedTodo = { list: ["test_1", "Test_2"] } as Todo;

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "findByUserId").mockImplementationOnce(() =>
        Promise.reject(new Error("test error msg from findByUserId"))
      );

      const app = express().use(todoRoutes(service)).use(handleException);
      const response = await request(app).get("/users/test_user/todos");

      expect(response.statusCode).toBe(999);
      expect(response.text).toEqual("test error msg from findByUserId");
    });
  });

  describe("PUT /todos", () => {
    test("accepts a list of string", async () => {
      const expectedTodo = { list: ["test_1", "Test_2"] } as Todo;

      const service = new TodoService(undefined as any);
      vi.spyOn(service, "upsertByUserId").mockReturnValueOnce(
        Promise.resolve(expectedTodo)
      );

      const app = express().use(todoRoutes(service)).use(failOnUnCatchError);

      const response = await request(app)
        .put("/users/test_user/todos")
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

      const app = express().use(todoRoutes(service)).use(handleException);

      const response = await request(app)
        .put("/users/test_user/todos")
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

      const app = express().use(todoRoutes(service)).use(handleException);

      const response = await request(app)
        .put("/users/test_user/todos")
        .send(expectedTodo);

      expect(response.statusCode).toBe(999);
      expect(response.body.data.input).toEqual(expectedTodo);
    });
  });
});

const failOnUnCatchError: ErrorRequestHandler = (err, _req, _res, _next) => {
  console.error(err);
  expect.fail(err?.message);
};
