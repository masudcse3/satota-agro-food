/*
  Warnings:

  - Added the required column `historyId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "historyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "OrderHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
