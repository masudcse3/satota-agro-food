/** @format */

import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string(),
  weight: z.number(),
  unit: z.enum(["kg", "bag"]).default("kg"),
  wholesalePrice: z.number(),
  retailPrice: z.number(),
  category: z.string(),
  sku: z.string().optional(),
  currentStock: z.number().default(0),
  source: z.enum(["SATOTA_AGRO", "LC", "OTHER"]).default("SATOTA_AGRO"),
});

export const productUpdateSchema = productCreateSchema.partial();
