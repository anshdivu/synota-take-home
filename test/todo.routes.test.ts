import { Todo } from "@prisma/client";
import express, { ErrorRequestHandler } from "express";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import todoRoutes from "../src/todo.routes";
import { TodoService } from "../src/todo.service";

describe("todo.routes", () => {
  test("PUT /todos accepts a list of string", async () => {
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

  test("PUT /todos fails when body not a list of string", async () => {
    const expectedTodo = { testObj: "invalid" };
    const service = new TodoService(undefined as any);

    const app = express()
      .use(todoRoutes(service))
      // @ts-expect-error
      .use((err, _req, res, _next) => {
        // convert error to response body
        res.status(999).send(err);
      });

    const response = await request(app)
      .put("/users/test_user/todos")
      .send(expectedTodo);

    expect(response.statusCode).toBe(999);
    expect(response.body.data.input).toEqual(expectedTodo);
  });
});

const failOnUnCatchError: ErrorRequestHandler = (err, _req, _res, _next) => {
  console.error(err);
  expect.fail(err?.message);
};
