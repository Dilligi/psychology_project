/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Message` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "User" AS ENUM ('Client', 'Psycho');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "PsySex" AS ENUM ('Male', 'Female', 'Default');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId",
DROP COLUMN "userName",
ADD COLUMN     "createdBy" "User" NOT NULL,
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "age" TIMESTAMP(3) NOT NULL,
    "timezone" INTEGER NOT NULL DEFAULT 3,
    "problems" TEXT[],
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "psySex" "PsySex" NOT NULL DEFAULT 'Default',

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Psycho" (
    "id" SERIAL NOT NULL,
    "age" TIMESTAMP(3) NOT NULL,
    "timezone" INTEGER NOT NULL DEFAULT 3,
    "problems" TEXT[],
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "document" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Psycho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "psychoId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Psycho_email_key" ON "Psycho"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_clientId_key" ON "Room"("clientId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_psychoId_fkey" FOREIGN KEY ("psychoId") REFERENCES "Psycho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
