import boom from "@hapi/boom";
import { PrismaClient, Todo, User } from "@prisma/client";
import express, { ErrorRequestHandler } from "express";
import request from "supertest";
import { describe, expect, test, vi } from "vitest";

import { basicAuthHandler } from "../auth.handler";

describe.concurrent("auth.handler", () => {
  test("throws 401 with msg `Authorization Header Not Found` when no auth headers found", async () => {
    const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
      res.status(err.output.payload.statusCode).send(err.message);
    };

    const app = express()
      .use(basicAuthHandler(undefined as any))
      .use("/", (_req, res) => res.status(200).send("test index"))
      .use(handleException);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Authorization Header Not Found");
  });

  test("throws 401 with msg `Invalid Credentials` when user not valid", async () => {
    const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
      res.status(err.output.payload.statusCode).send(err.message);
    };

    const mockFindFirst = vi.fn().mockReturnValueOnce(Promise.resolve(null));
    const mockDb: PrismaClient = { user: { findFirst: mockFindFirst } } as any;

    const app = express()
      .use(basicAuthHandler(mockDb))
      .use("/", (_req, res) => res.status(200).send("test index"))
      .use(handleException);

    const response = await request(app)
      .get("/")
      .set({
        Authorization:
          "Basic " + Buffer.from("testUser:testPass").toString("base64"),
      });

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { username: "testUser" },
    });
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Invalid Credentials");
  });

  test("throws 401 with msg `Invalid Credentials` when pass not valid", async () => {
    const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
      res.status(err.output.payload.statusCode).send(err.message);
    };

    const mockFindFirst = vi.fn().mockReturnValueOnce(
      Promise.resolve({
        salt: Buffer.from("testSalt1"),
        hashedPassword: Buffer.from("invalid"),
      } satisfies Partial<User>)
    );
    const mockDb: PrismaClient = {
      user: { findFirst: mockFindFirst },
    } as any;

    const app = express()
      .use(basicAuthHandler(mockDb))
      .use("/", (_req, res) => res.status(200).send("test index"))
      .use(handleException);

    const response = await request(app)
      .get("/")
      .set({
        Authorization:
          "Basic " + Buffer.from("testUser:testPass").toString("base64"),
      });

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { username: "testUser" },
    });
    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Invalid Credentials");
  });

  test("return user when creds are valid", async () => {
    const handleException: ErrorRequestHandler = (err, _req, res, _next) => {
      res.status(err.output.payload.statusCode).send(err.message);
    };

    const mockUser = {
      salt: Buffer.from("testSalt1"),
      hashedPassword: Buffer.from(
        "80637befeb1c5deafb14e72f4dee3976936074a3050ead6e5194573175d909dc",
        "hex"
      ),
    } satisfies Partial<User>;

    const mockFindFirst = vi
      .fn()
      .mockReturnValueOnce(Promise.resolve(mockUser));
    const mockDb: PrismaClient = {
      user: { findFirst: mockFindFirst },
    } as any;

    const app = express()
      .use(basicAuthHandler(mockDb))
      .use("/", (_req, res) => res.status(200).send("test index"))
      .use(handleException);

    const response = await request(app)
      .get("/")
      .set({
        Authorization:
          "Basic " + Buffer.from("testUser1:testPass1").toString("base64"),
      });

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { username: "testUser1" },
    });
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("test index");
  });
});
