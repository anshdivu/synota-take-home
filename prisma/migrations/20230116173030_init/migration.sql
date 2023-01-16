-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "content" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Todo_authorId_key" ON "Todo"("authorId");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
