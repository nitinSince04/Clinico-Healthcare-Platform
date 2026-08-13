import { z } from "zod";

export const bookingSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Appointment date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  type: z.enum(["IN_PERSON", "VIDEO"]),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
