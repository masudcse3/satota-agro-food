-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_sku_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_sku_fkey";

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Stock"("sku") ON DELETE CASCADE ON UPDATE CASCADE;
