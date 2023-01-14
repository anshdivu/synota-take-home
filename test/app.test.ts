import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe.concurrent("app.ts", () => {
  it("/liveness return 'Live' when app running", async () => {
    const response = await request(app).get("/liveness");

    expect(response.text).toBe("Live");
    expect(response.statusCode).toBe(200);
  });

  it("/readiness return 'Ready' when app running", async () => {
    const response = await request(app).get("/readiness");

    expect(response.text).toBe("Ready");
    expect(response.statusCode).toBe(200);
  });
});
