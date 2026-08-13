import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).default("PATIENT"),
  // Patient fields
  age: z.coerce.number().min(1).max(120).optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalHistory: z.string().optional(),
  // Doctor fields
  specialty: z.string().optional(),
  bio: z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
  consultationFee: z.coerce.number().min(0).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
