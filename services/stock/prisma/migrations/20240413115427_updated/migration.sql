/*
  Warnings:

  - You are about to drop the column `sku` on the `StockHistory` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockId` to the `StockHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_sku_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_sku_fkey";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockHistory" DROP COLUMN "sku",
ADD COLUMN     "stockId" TEXT NOT NULL,
ALTER COLUMN "actionType" SET DEFAULT 'IN',
ALTER COLUMN "lastStock" DROP NOT NULL,
ALTER COLUMN "lastStock" SET DEFAULT 0;

-- DropTable
DROP TABLE "Product";

-- DropEnum
DROP TYPE "Unit";

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_key" ON "Stock"("productId");

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
