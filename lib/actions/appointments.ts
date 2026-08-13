"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { bookingSchema, BookingInput } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";

export async function bookAppointment(input: BookingInput) {
  try {
    const session = await getAuthSession();
    if (!session || !session.user) {
      return { success: false, error: "Authentication required to book an appointment." };
    }

    const validated = bookingSchema.parse(input);
    const appointmentDate = new Date(validated.date);
    appointmentDate.setHours(0, 0, 0, 0);

    // Double-booking check: Ensure no active appointment exists for this doctor, date, and timeSlot
    const existingDoctorAppointment = await db.appointment.findFirst({
      where: {
        doctorId: validated.doctorId,
        date: appointmentDate,
        timeSlot: validated.timeSlot,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingDoctorAppointment) {
      return {
        success: false,
        error: `Slot ${validated.timeSlot} on ${appointmentDate.toLocaleDateString()} is no longer available. Please select another slot.`,
      };
    }

    // Check if the patient already has an appointment at this exact slot
    const existingPatientAppointment = await db.appointment.findFirst({
      where: {
        patientId: session.user.id,
        date: appointmentDate,
        timeSlot: validated.timeSlot,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingPatientAppointment) {
      return {
        success: false,
        error: "You already have another appointment scheduled at this exact time slot.",
      };
    }

    const newAppointment = await db.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId: validated.doctorId,
        date: appointmentDate,
        timeSlot: validated.timeSlot,
        type: validated.type,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        notes: validated.notes || "Standard Consultation",
      },
    });

    revalidatePath("/dashboard/patient");
    revalidatePath("/dashboard/doctor");
    revalidatePath(`/doctors/${validated.doctorId}`);

    return { success: true, appointmentId: newAppointment.id };
  } catch (error: any) {
    console.error("Book Appointment Error:", error);
    return { success: false, error: error.message || "Failed to book appointment." };
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
  try {
    const session = await getAuthSession();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const appointment = await db.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });

    revalidatePath("/dashboard/doctor");
    revalidatePath("/dashboard/patient");
    revalidatePath("/dashboard/admin");

    return { success: true, appointment };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update status." };
  }
}

export async function getPatientAppointments(patientId: string) {
  try {
    const appointments = await db.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            doctorProfile: true,
          },
        },
        prescription: true,
      },
      orderBy: { date: "desc" },
    });
    return { success: true, appointments };
  } catch (error: any) {
    return { success: false, error: error.message, appointments: [] };
  }
}

export async function getDoctorAppointments(doctorId: string) {
  try {
    const appointments = await db.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: {
            patientProfile: true,
          },
        },
        prescription: true,
      },
      orderBy: { date: "desc" },
    });
    return { success: true, appointments };
  } catch (error: any) {
    return { success: false, error: error.message, appointments: [] };
  }
}
