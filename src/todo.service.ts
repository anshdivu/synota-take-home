import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { z } from "zod";

const TodoValidator = z.array(z.string());

class TodoService {
  constructor(private db: PrismaClient) {}

  isValid(todoList: unknown) {
    const result = TodoValidator.safeParse(todoList);
    if (result.success) return [result.data, undefined] as const;

    const error400 = boom.badRequest(
      "Invalid Input. Expected an array of strings.",
      { input: todoList, meta: result.error.issues }
    );

    return [undefined, error400] as const;
  }

  async findByUserId(userId: number) {
    try {
      return await this.db.todo.findFirstOrThrow({
        where: { authorId: userId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw boom.notFound(`No Todo Items found for user: ${userId}`, {
          meta: error.meta,
          cause: error.message,
        });
      }

      throw error;
    }
  }

  async upsertByUserId(userId: number, todoList: string[]) {
    return await this.db.todo.upsert({
      where: { authorId: userId },
      update: { list: todoList },
      create: { authorId: userId, list: todoList },
    });
  }
}

export { TodoService };
