/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `retailPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wholesalePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "retailPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "wholesalePrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ProductPricingHistory" (
    "id" TEXT NOT NULL,
    "wholesalePrice" DOUBLE PRECISION NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductPricingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPricingHistory" ADD CONSTRAINT "ProductPricingHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
