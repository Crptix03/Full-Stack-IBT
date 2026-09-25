import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^(?:\+251|0)[79]\d{8}$/, "Enter a valid Ethiopian number"),
  address: z.string().min(4, "Address is required"),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    qty: z.number().int().positive(),
  })).min(1, "Cart is empty"),
});