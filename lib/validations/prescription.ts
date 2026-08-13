import { z } from "zod";

export const medicineItemSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  dose: z.string().min(1, "Dosage is required (e.g. 500mg, 1 tablet)"),
  frequency: z.string().min(1, "Frequency is required (e.g. Twice daily after meals)"),
  duration: z.string().min(1, "Duration is required (e.g. 7 days, 1 month)"),
});

export const prescriptionSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  diagnosis: z.string().min(3, "Diagnosis summary is required"),
  medicines: z.array(medicineItemSchema).min(1, "At least one medicine must be prescribed"),
});

export type MedicineItem = z.infer<typeof medicineItemSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
