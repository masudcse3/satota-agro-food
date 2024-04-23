-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('kg', 'bag');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('SATOTA_AGRO', 'LC', 'OTHER');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "unit" "Unit" NOT NULL DEFAULT 'kg',
    "sku" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL DEFAULT 'OUT',
    "qunatity" INTEGER NOT NULL,
    "lastStock" INTEGER NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "source" "Source" NOT NULL DEFAULT 'SATOTA_AGRO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_sku_key" ON "Stock"("sku");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
