/** @format */

import { z } from "zod";

export const cartSchema = z.object({
  productID: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export const orderSchema = z.object({
  customerID: z.string(),
  products: z.array(cartSchema),
  discount: z.number().default(0),
  paid: z.number(),
  paymentMethod: z.enum(["Cash", "Check", "Other"]).default("Cash"),
  soldBy: z.string(),
});

export const orderUpdateSchema = orderSchema.omit({ customerID: true });
