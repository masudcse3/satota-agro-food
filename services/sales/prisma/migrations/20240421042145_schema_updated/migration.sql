/*
  Warnings:

  - You are about to drop the column `orderHistoryId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_orderHistoryId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "orderHistoryId";
