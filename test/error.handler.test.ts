import boom from "@hapi/boom";
import express, { ErrorRequestHandler } from "express";
import request from "supertest";
import { describe, expect, test } from "vitest";

import handleErrors from "../src/error.handler";

describe.concurrent("error.handler", () => {
  test("handles boom errors", async () => {
    const expectedInput = { input: "test input" };
    const app = express()
      .use("/", () => {
        throw boom.badRequest("test error", expectedInput);
      })
      .use(handleErrors);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "test error", ...expectedInput });
  });

  test("returns 500 status and message from unknown errors", async () => {
    const app = express()
      .use("/", () => {
        throw new Error("random error message");
      })
      .use(handleErrors);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "random error message" });
  });

  test("returns 500 status and err", async () => {
    const app = express()
      .use("/", () => {
        throw new Error();
      })
      .use(handleErrors);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Unknown Error" });
  });
});
