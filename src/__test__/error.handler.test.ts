import boom from "@hapi/boom";
import express from "express";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { errorHandler } from "../error.handler";

describe.concurrent("error.handler", () => {
  test("handles boom errors", async () => {
    const expectedInput = { input: "test input" };
    const app = express()
      .use("/", () => {
        throw boom.badRequest("test error", expectedInput);
      })
      .use(errorHandler);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "test error", ...expectedInput });
  });

  test("returns 500 status and message from unknown errors", async () => {
    const app = express()
      .use("/", () => {
        throw new Error("test error msg");
      })
      .use(errorHandler);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "test error msg" });
  });

  test("returns 500 status and err", async () => {
    const app = express()
      .use("/", () => {
        throw new Error();
      })
      .use(errorHandler);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});
