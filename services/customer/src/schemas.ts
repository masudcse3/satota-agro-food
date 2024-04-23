/** @format */

import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().refine((value) => /^01\d{9}$/.test(value), {
    message: 'Phone number must start with "01" and be 11 digits long',
  }),
  password: z.string(),
  address: z.string(),
  image: z.string(),
  type: z.enum(["Wholesaler", "Retailer"]).default("Wholesaler"),
  status: z.enum(["Active", "Inactive"]).default("Inactive"),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});
