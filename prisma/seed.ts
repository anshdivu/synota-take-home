import { PrismaClient } from "@prisma/client";

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
    where: { email: "mail@diviyansh.me" },
    update: {},
    create: { email: "contact@diviyansh.me", name: "Ansh" },
  });

  const max = await db.user.upsert({
    where: { email: "MDignan@synota.io" },
    update: {},
    create: {
      email: "MDignan@synota.io",
      name: "Max",
      todo: { create: { list: ["Item 1", "Item 2"] } },
    },
  });

  const colin = await db.user.upsert({
    where: { email: "Colin@synota.io" },
    update: {},
    create: { email: "Colin@synota.io", name: "Colin" },
  });

  console.log({ ansh, max, colin });
}
