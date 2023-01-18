import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { hashAndSalt } from "../src/auth.handler";

const prisma = new PrismaClient();

main(prisma)
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function main(db: PrismaClient) {
  const ansh = await db.user.upsert({
    where: { email: "contact@diviyansh.me" },
    update: {},
    create: {
      email: "contact@diviyansh.me",
      username: "ansh",
      ...createSaltAndPassword("ansh123"),
    },
  });

  const max = await db.user.upsert({
    where: { email: "MDignan@synota.io" },
    update: {},
    create: {
      email: "MDignan@synota.io",
      username: "max",
      ...createSaltAndPassword("max456"),
      todo: { create: { list: ["Item 1", "Item 2"] } },
    },
  });

  const colin = await db.user.upsert({
    where: { email: "Colin@synota.io" },
    update: {},
    create: {
      email: "Colin@synota.io",
      username: "colin",
      ...createSaltAndPassword("colin789"),
    },
  });

  console.log({ ansh, max, colin });
}

function createSaltAndPassword(pass: string) {
  const randomSalt = crypto.randomBytes(16);
  const hashedPassword = hashAndSalt(pass, randomSalt);

  return { salt: randomSalt, hashedPassword };
}
