"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { prescriptionSchema, PrescriptionInput } from "@/lib/validations/prescription";
import { revalidatePath } from "next/cache";

export async function createPrescription(input: PrescriptionInput) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "DOCTOR") {
      return { success: false, error: "Only authorized doctors can issue prescriptions." };
    }

    const validated = prescriptionSchema.parse(input);

    const appointment = await db.appointment.findUnique({
      where: { id: validated.appointmentId },
    });

    if (!appointment) {
      return { success: false, error: "Associated appointment not found." };
    }

    // Upsert prescription
    const prescription = await db.prescription.upsert({
      where: { appointmentId: validated.appointmentId },
      create: {
        appointmentId: validated.appointmentId,
        doctorId: session.user.id,
        patientId: appointment.patientId,
        diagnosis: validated.diagnosis,
        medicines: JSON.stringify(validated.medicines),
        pdfUrl: `/prescriptions/pdf-${validated.appointmentId}.pdf`,
      },
      update: {
        diagnosis: validated.diagnosis,
        medicines: JSON.stringify(validated.medicines),
      },
    });

    // Mark appointment status as COMPLETED
    await db.appointment.update({
      where: { id: validated.appointmentId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/dashboard/doctor");
    revalidatePath("/dashboard/patient");

    return { success: true, prescription };
  } catch (error: any) {
    console.error("Create Prescription Error:", error);
    return { success: false, error: error.message || "Failed to issue prescription." };
  }
}

export async function getPrescriptionByAppointment(appointmentId: string) {
  try {
    const prescription = await db.prescription.findUnique({
      where: { appointmentId },
      include: {
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } },
        appointment: true,
      },
    });

    if (!prescription) {
      return { success: false, error: "Prescription not found." };
    }

    return { success: true, prescription };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
