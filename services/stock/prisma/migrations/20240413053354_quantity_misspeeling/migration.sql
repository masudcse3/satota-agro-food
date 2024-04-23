/*
  Warnings:

  - You are about to drop the column `qunatity` on the `StockHistory` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `StockHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockHistory" DROP COLUMN "qunatity",
ADD COLUMN     "quantity" INTEGER NOT NULL;
