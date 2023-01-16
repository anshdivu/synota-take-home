import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import app from "../src/app";

describe.concurrent("app.ts", () => {
  vi.mock("@prisma/client", () => {
    const PrismaClient = vi.fn();
    PrismaClient.prototype.$connect = vi.fn();

    return { PrismaClient };
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("/alive return 'Live' when app running", async () => {
    const response = await request(app).get("/alive");

    expect(response.text).toBe("Live");
    expect(response.statusCode).toBe(200);
  });

  it("/ready return 'Ready' when app running", async () => {
    const response = await request(app).get("/ready");

    expect(response.text).toBe("Ready");
    expect(response.statusCode).toBe(200);
  });
});
