import express, { ErrorRequestHandler } from "express";
import request from "supertest";
import { describe, expect, test } from "vitest";

import handleErrors from "../src/error.handler";
import todoRoutes from "../src/todo.routes";

describe.concurrent("todo.routes", () => {
  test("PUT /todos accepts a list of string", async () => {
    const expectedTodo = ["todo 1", "todo 2"];
    const app = express().use(todoRoutes).use(testErrorHandler);

    const response = await request(app)
      .put("/users/test_user/todos")
      .send(expectedTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expectedTodo);
  });

  test("PUT /todos fails when body not a list of string", async () => {
    const expectedTodo = { testObj: "invalid" };
    const app = express().use(todoRoutes).use(handleErrors);

    const response = await request(app)
      .put("/users/test_user/todos")
      .send(expectedTodo);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid Input. This endpoint expects an array of strings",
      input: expectedTodo,
    });
  });
});

const testErrorHandler: ErrorRequestHandler = (err, _req, _res, _next) => {
  console.error(err);
  expect.fail(err?.message);
};
