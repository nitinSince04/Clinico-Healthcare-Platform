import { z } from "zod";

export const doctorOnboardingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  experienceYears: z.coerce.number().min(0, "Experience years cannot be negative"),
  consultationFee: z.coerce.number().min(0, "Consultation fee cannot be negative"),
  location: z.string().optional(),
});

export const scheduleUpdateSchema = z.object({
  availableSlots: z.array(z.string()).min(1, "At least one available slot must be selected"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type DoctorOnboardingInput = z.infer<typeof doctorOnboardingSchema>;
export type ScheduleUpdateInput = z.infer<typeof scheduleUpdateSchema>;
