
import { z } from "zod";

export const serviceSchema = z.strictObject({
  title: z.string().trim().min(5),
  hourly_rate: z.number().finite().nonnegative(),
  duration_minutes: z.number().int().min(15),
  coverage_radius_miles: z.number().int().positive(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
