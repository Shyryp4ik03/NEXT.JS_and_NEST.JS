/*
  Warnings:

  - You are about to drop the column `apartment` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `house` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Resident` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dataId]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Resident` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Resident_pin_key";

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "apartment",
DROP COLUMN "house",
DROP COLUMN "pin",
DROP COLUMN "street",
ADD COLUMN     "dataId" INTEGER,
ADD COLUMN     "fullName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "apartment" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Data_pinCode_key" ON "Data"("pinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_dataId_key" ON "Resident"("dataId");

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "Data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
