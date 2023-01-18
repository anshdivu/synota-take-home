import boom from "@hapi/boom";
import { PrismaClient, Todo } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { afterEach, describe, expect, test, vi } from "vitest";
import { TodoService } from "../todo.service";

describe.concurrent("todo.service", () => {
  test("constructor", async () => {
    const db = new PrismaClient();
    const service = new TodoService(db);
    expect(service["db"]).toBe(db);
  });

  test("isValid return same result in tuple for valid input", async () => {
    const service = new TodoService(undefined as any);

    const [result, error] = service.isValid(["test1", "test2"]);

    expect(result).toEqual(["test1", "test2"]);
    expect(error).toEqual(undefined);
  });

  test("isValid return error in tuple for invalid input", async () => {
    const service = new TodoService(undefined as any);

    const [result, error] = service.isValid({ invalid: "test obj" });

    expect(result).toEqual(undefined);
    expect(error?.message).toEqual(
      "Invalid Input. Expected an array of strings."
    );
    expect(error?.data?.input).toEqual({ invalid: "test obj" });
    expect(error?.data?.meta).toEqual([
      {
        code: "invalid_type",
        expected: "array",
        message: "Expected array, received object",
        path: [],
        received: "object",
      },
    ]);
  });

  test("findByUserId return Todo from DB", async () => {
    const expectedTodo = { list: ["test1"] } as Todo;

    const db = new PrismaClient();
    vi.spyOn(db, "todo", "get").mockReturnValue({
      // @ts-expect-error
      findFirstOrThrow: vi.fn(() => Promise.resolve(expectedTodo)),
    });
    const service = new TodoService(db);

    const todoList = await service.findByUserId(10);

    expect(todoList).toEqual(expectedTodo);
    expect(db.todo.findFirstOrThrow).toHaveBeenCalledOnce();
    expect(db.todo.findFirstOrThrow).toHaveBeenCalledWith({
      where: { authorId: 10 },
    });
  });

  test("findByUserId return notFound error when Prisma fails", async () => {
    const db = new PrismaClient();
    const expectedError = new Error("test error");
    vi.spyOn(db, "todo", "get").mockReturnValue({
      // @ts-expect-error
      findFirstOrThrow: vi.fn(() => Promise.reject(expectedError)),
    });
    const service = new TodoService(db);

    try {
      await service.findByUserId(10);
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });

  test("findByUserId return notFound error when Prisma fails", async () => {
    const db = new PrismaClient();
    const expectedError = new PrismaClientKnownRequestError("test error", {
      meta: { a: 1 },
      code: "T1",
      clientVersion: "V1",
    });
    vi.spyOn(db, "todo", "get").mockReturnValue({
      // @ts-expect-error
      findFirstOrThrow: vi.fn(() => Promise.reject(expectedError)),
    });
    const service = new TodoService(db);

    try {
      await service.findByUserId(10);
    } catch (error: any) {
      expect(error.message).toEqual("No Todo Items found for user: 10");
      expect(error.data).toEqual({ cause: "test error", meta: { a: 1 } });
    }
  });

  test("upsertByUserId return Todo from DB", async () => {
    const expectedTodo = ["test1"];

    const db = new PrismaClient();
    vi.spyOn(db, "todo", "get").mockReturnValue({
      // @ts-expect-error
      upsert: vi.fn(() => Promise.resolve({ list: expectedTodo })),
    });
    const service = new TodoService(db);

    const todoList = await service.upsertByUserId(10, expectedTodo);

    expect(todoList).toEqual({ list: expectedTodo });
    expect(db.todo.upsert).toHaveBeenCalledOnce();
    expect(db.todo.upsert).toHaveBeenCalledWith({
      where: { authorId: 10 },
      update: { list: expectedTodo },
      create: { authorId: 10, list: expectedTodo },
    });
  });
});
