
import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(2000).optional(),
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(2).max(50),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/),
  price: z.number().nonnegative().max(9999999999.99),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().nonnegative().max(99.9).optional(),
}).strict();

export type ListingInput = z.infer<typeof listingSchema>;
