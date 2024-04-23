/** @format */

import { z } from "zod";

export const createStockSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  sku: z.string(),
  currentStock: z.number(),
});

export const updateStockSchema = createStockSchema
  .omit({ sku: true })
  .partial();

export const createStockHistorySchema = z.object({
  actionType: z.enum(["IN", "OUT"]).default("IN"),
  quantity: z.number(),
  source: z
    .enum(["SATOTA_AGRO", "LC", "OTHER", "SALES"])
    .default("SATOTA_AGRO"),
});
